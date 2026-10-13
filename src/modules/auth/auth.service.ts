import { BadRequestException, ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { generateUniqueReferralCode } from '../../common/utils/referral-code.util';
import { SignupCampaignService } from '../signup-campaign/signup-campaign.service';
import { normalizeCountryInput } from '../../common/utils/country.util';
import { MailService } from './mail.service';

const BCRYPT_ROUNDS = 12;
const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000;
const SITE_URL = process.env.SITE_URL ?? 'https://9issmaonassib.com';

type ResetLocale = 'ar' | 'fr' | 'en' | 'es';

const RESET_EMAIL: Record<ResetLocale, { subject: string; body: (name: string, link: string) => string }> = {
  ar: {
    subject: 'إعادة تعيين كلمة المرور',
    body: (name, link) =>
      `<div dir="rtl"><p>مرحباً ${name}،</p><p>توصلنا بطلب لإعادة تعيين كلمة المرور ديال حسابك. اضغط على الرابط التالي لاختيار كلمة مرور جديدة (صالح لمدة 30 دقيقة):</p><p><a href="${link}">${link}</a></p><p>إذا لم تطلب ذلك، تجاهل هذه الرسالة وستبقى كلمة مرورك كما هي.</p></div>`,
  },
  fr: {
    subject: 'Réinitialisation de votre mot de passe',
    body: (name, link) =>
      `<p>Bonjour ${name},</p><p>Nous avons reçu une demande de réinitialisation du mot de passe de votre compte. Cliquez sur le lien ci-dessous pour en choisir un nouveau (valable 30 minutes) :</p><p><a href="${link}">${link}</a></p><p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>`,
  },
  en: {
    subject: 'Reset your password',
    body: (name, link) =>
      `<p>Hello ${name},</p><p>We received a request to reset your account password. Click the link below to choose a new one (valid for 30 minutes):</p><p><a href="${link}">${link}</a></p><p>If you didn't request this, you can ignore this email.</p>`,
  },
  es: {
    subject: 'Restablecer tu contraseña',
    body: (name, link) =>
      `<p>Hola ${name},</p><p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el enlace para elegir una nueva (válido 30 minutos):</p><p><a href="${link}">${link}</a></p><p>Si no lo solicitaste, ignora este correo.</p>`,
  },
};

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function hashResetToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly signupCampaignService: SignupCampaignService,
    private readonly mailService: MailService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async isPhoneAvailable(phoneNumber: string) {
    if (!phoneNumber) return true;
    const existing = await this.userModel.findOne({ phoneNumber }).select('_id');
    return !existing;
  }

  async register(dto: RegisterDto) {
    const existingPhone = await this.userModel.findOne({ phoneNumber: dto.phoneNumber });
    if (existingPhone) {
      throw new ConflictException('Phone number already registered');
    }

    const existingEmail = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const referralCode = await generateUniqueReferralCode(this.userModel);

    // Best-effort: an unknown/malformed referral code should never block signup.
    let referredBy: Types.ObjectId | undefined;
    if (dto.referralCode) {
      const referrer = await this.userModel.findOne({ referralCode: dto.referralCode.trim().toUpperCase() });
      if (referrer) referredBy = referrer._id as Types.ObjectId;
    }

    const campaignVipDays = await this.signupCampaignService.getActiveVipDays();

    const user = await this.userModel.create({
      phoneNumber: dto.phoneNumber,
      email: dto.email.toLowerCase(),
      passwordHash,
      referralCode,
      referredBy,
      subscriptionTier: campaignVipDays ? 'VIP' : 'FREE',
      vipExpiresAt: campaignVipDays ? new Date(Date.now() + campaignVipDays * 24 * 60 * 60 * 1000) : undefined,
      joinedViaSignupCampaign: !!campaignVipDays,
      profile: {
        firstName: dto.firstName,
        gender: dto.gender,
        birthDate: dto.birthDate,
        residenceCountry: normalizeCountryInput(dto.residenceCountry),
        currentCity: dto.currentCity,
        originCountry: normalizeCountryInput(dto.originCountry),
      },
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    // The login field accepts a phone number or an email (the field keeps its
    // old name so already-installed app versions keep working).
    const identifier = dto.phoneNumber.trim();
    const user = await this.userModel.findOne(
      identifier.includes('@') ? { email: identifier.toLowerCase() } : { phoneNumber: identifier },
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  /**
   * Emails a single-use reset link if an account has this email. Always
   * resolves the same way whether or not it exists, so the endpoint cannot be
   * used to discover which emails are registered.
   */
  async requestPasswordReset(email: string, locale: ResetLocale) {
    const user = await this.userModel.findOne({ email: email.trim().toLowerCase() });
    if (!user || !user.email) return;

    const token = randomBytes(32).toString('hex');
    user.passwordResetTokenHash = hashResetToken(token);
    user.passwordResetExpiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);
    await user.save();

    const link = `${SITE_URL}/${locale}/reset-password?token=${token}`;
    const template = RESET_EMAIL[locale];
    try {
      await this.mailService.send(user.email, template.subject, template.body(escapeHtml(user.profile.firstName), link));
    } catch (error) {
      this.logger.error(`Failed to send password reset email to user ${String(user._id)}`, error as Error);
    }
  }

  async resetPassword(token: string, password: string) {
    const user = await this.userModel.findOne({
      passwordResetTokenHash: hashResetToken(token),
      passwordResetExpiresAt: { $gt: new Date() },
    });
    if (!user) throw new BadRequestException('Invalid or expired reset link');

    user.passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();
  }

  private buildAuthResponse(user: User) {
    const userId = (user._id as Types.ObjectId).toString();
    const payload = { sub: userId, phoneNumber: user.phoneNumber };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: userId,
        phoneNumber: user.phoneNumber,
        subscriptionTier: user.subscriptionTier,
        referralCode: user.referralCode,
        profile: user.profile,
      },
    };
  }
}

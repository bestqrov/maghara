import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

/**
 * Sends transactional email over SMTP (works with Hostinger mail, Gmail,
 * Brevo, …). When SMTP_HOST is not configured — e.g. local development — the
 * message is logged instead of sent, so flows that email a link still work.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter | null;
  private readonly from: string;

  constructor(config: ConfigService) {
    const host = config.get<string>('SMTP_HOST');
    const port = Number(config.get<string>('SMTP_PORT') ?? 465);
    this.from = config.get<string>('MAIL_FROM') ?? config.get<string>('SMTP_USER') ?? 'no-reply@9issmaonassib.com';
    this.transporter = host
      ? nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user: config.get<string>('SMTP_USER'), pass: config.get<string>('SMTP_PASS') },
        })
      : null;
  }

  async send(to: string, subject: string, html: string) {
    if (!this.transporter) {
      this.logger.warn(`SMTP_HOST not set — email to ${to} not sent. Subject: ${subject}\n${html}`);
      return;
    }
    await this.transporter.sendMail({ from: this.from, to, subject, html });
  }
}

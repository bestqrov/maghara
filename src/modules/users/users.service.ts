import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async findById(userId: string) {
    const user = await this.userModel.findById(userId).select('-passwordHash');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const { minAge, maxAge, targetCountries, targetCities, ...profileFields } = dto;
    Object.assign(user.profile, profileFields);

    if (minAge !== undefined || maxAge !== undefined || targetCountries || targetCities) {
      user.profile.matchCriteria = {
        ...user.profile.matchCriteria,
        ...(minAge !== undefined && { minAge }),
        ...(maxAge !== undefined && { maxAge }),
        ...(targetCountries && { targetCountries }),
        ...(targetCities && { targetCities }),
      } as any;
    }

    await user.save();
    return this.findById(userId);
  }
}

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { PublicService } from './public.service';
import { PublicProfilesQueryDto } from './dto/public-profiles-query.dto';

/**
 * No JwtAuthGuard here on purpose — this controller is the app's only
 * unauthenticated surface (consumed by the programmatic SEO landing pages
 * and any crawler hitting them), so it gets its own rate limit instead of
 * relying on a per-user JWT to bound request volume.
 */
@UseGuards(ThrottlerGuard)
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('profiles')
  getProfiles(@Query() dto: PublicProfilesQueryDto) {
    return this.publicService.getVerifiedPreviewProfiles(dto);
  }
}

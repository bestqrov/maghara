import { Controller, Get, NotFoundException, Param, Query, Res, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Response } from 'express';
import { PublicService } from './public.service';
import { PublicProfilesQueryDto } from './dto/public-profiles-query.dto';
import { decryptPhotoToken, toBlurredPhotoUrl } from '../../common/utils/photo-blur.util';

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

  /**
   * Serves the blurred rendition of a locked search teaser's photo. Loaded by
   * plain <img> tags (no auth header), so access rests on the token: it is an
   * encrypted original URL only the server can open, which keeps the
   * original's Cloudinary public ID from ever reaching the client.
   */
  @Get('blurred-photo/:token')
  async getBlurredPhoto(@Param('token') token: string, @Res() res: Response) {
    const original = decryptPhotoToken(token);
    const blurredUrl = original ? toBlurredPhotoUrl(original) : null;
    if (!blurredUrl) throw new NotFoundException();

    const upstream = await fetch(blurredUrl);
    if (!upstream.ok) throw new NotFoundException();

    res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(Buffer.from(await upstream.arrayBuffer()));
  }
}

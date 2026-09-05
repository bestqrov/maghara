import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

class AdPlacementsDto {
  @IsOptional() @IsBoolean() bannerHome?: boolean;
  @IsOptional() @IsBoolean() bannerMatches?: boolean;
  @IsOptional() @IsBoolean() bannerVisitors?: boolean;
  @IsOptional() @IsBoolean() interstitialFeed?: boolean;
  @IsOptional() @IsBoolean() nativeFeed?: boolean;
  @IsOptional() @IsBoolean() appOpenAd?: boolean;
}

export class UpdateAdSettingsDto {
  @IsOptional() @IsBoolean() active?: boolean;
  @IsOptional() @IsIn(['ADMOB']) primaryAdNetwork?: string;

  @IsOptional() @IsString() admobAppId?: string;
  @IsOptional() @IsString() admobPublisherId?: string;
  @IsOptional() @IsString() admobBannerAdUnitId?: string;
  @IsOptional() @IsString() admobInterstitialAdUnitId?: string;
  @IsOptional() @IsString() admobNativeAdUnitId?: string;
  @IsOptional() @IsString() admobAppOpenAdUnitId?: string;

  @IsOptional() @IsInt() @Min(1) interstitialAdInterval?: number;
  @IsOptional() @IsInt() @Min(1) nativeAdIndex?: number;

  @IsOptional() @ValidateNested() @Type(() => AdPlacementsDto) placements?: AdPlacementsDto;
}

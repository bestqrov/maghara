import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

class AppConfigGeneralDto {
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() author?: string;
  @IsOptional() @IsString() contact?: string;
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsString() developedBy?: string;
  @IsOptional() @IsString() description?: string;
}

class AppConfigSettingsDto {
  @IsOptional() @IsBoolean() maintenanceMode?: boolean;
  @IsOptional() @IsString() maintenanceMessage?: string;
  @IsOptional() @IsBoolean() screenshotBlock?: boolean;
}

class LegalDocDto {
  @IsOptional() @IsString() url?: string;
  @IsOptional() @IsString() content?: string;
}

class AppUpdateConfigDto {
  @IsOptional() @IsBoolean() enabled?: boolean;
  @IsOptional() @IsInt() @Min(1) requiredVersionCode?: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() appLink?: string;
}

class AppBuildsDto {
  @IsOptional() @IsString() apkUrl?: string;
  @IsOptional() @IsString() aabUrl?: string;
}

export class UpdateAppConfigDto {
  @IsOptional() @ValidateNested() @Type(() => AppConfigGeneralDto) general?: AppConfigGeneralDto;
  @IsOptional() @ValidateNested() @Type(() => AppConfigSettingsDto) appSettings?: AppConfigSettingsDto;
  @IsOptional() @ValidateNested() @Type(() => LegalDocDto) privacyPolicy?: LegalDocDto;
  @IsOptional() @ValidateNested() @Type(() => LegalDocDto) termsConditions?: LegalDocDto;
  @IsOptional() @ValidateNested() @Type(() => AppUpdateConfigDto) appUpdate?: AppUpdateConfigDto;
  @IsOptional() @ValidateNested() @Type(() => AppBuildsDto) builds?: AppBuildsDto;
  @IsOptional() @IsString() moreAppsLink?: string;
}

import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchProfilesDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(18) minAge?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Max(90) maxAge?: number;
  @IsOptional() @IsString() targetCountry?: string;
  @IsOptional() @IsString() targetCity?: string;

  @IsOptional()
  @IsIn(['OPEN_TO_MOVE', 'LOOKING_FOR_EXPAT', 'LOCAL_ONLY'])
  relocationPreference?: string;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) limit?: number = 20;
}

import { IsArray, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() currentCity?: string;
  @IsOptional() @IsString() residenceCountry?: string;
  @IsOptional() @IsString() originCountry?: string;
  @IsOptional()
  @IsIn(['OPEN_TO_MOVE', 'LOOKING_FOR_EXPAT', 'LOCAL_ONLY'])
  relocationPreference?: string;
  @IsOptional() @IsString() jobTitle?: string;
  @IsOptional() @IsString() educationLevel?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) photos?: string[];

  @IsOptional() @IsString() waliName?: string;
  @IsOptional() @IsString() waliPhone?: string;
  @IsOptional() @IsString() waliRelationship?: string;

  @IsOptional() @IsInt() @Min(18) minAge?: number;
  @IsOptional() @IsInt() @Max(90) maxAge?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) targetCountries?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) targetCities?: string[];
}

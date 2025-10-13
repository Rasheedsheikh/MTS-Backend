// src/advertisements/dto/create-advertisement.dto.ts
import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateAdvertisementDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  location: string;

  // This will be filled after upload
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
sliderType?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

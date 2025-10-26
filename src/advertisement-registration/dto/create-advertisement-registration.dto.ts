// src/advertisement-registration/dto/create-advertisement-registration.dto.ts
import { IsString, IsOptional, IsBoolean, IsDateString, IsNumber, IsEnum } from 'class-validator';

export class CreateAdvertisementRegistrationDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  location: string;

  @IsString()
  mobileNumber: string;

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
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsEnum(['pending', 'completed', 'failed'])
  paymentStatus?: 'pending' | 'completed' | 'failed';

  @IsOptional()
  @IsBoolean()
  isPaymentCompleted?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

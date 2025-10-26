import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreatePaymentOrderDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  location: string;

  @IsString()
  mobileNumber: string;

  @IsOptional()
  @IsString()
  sliderType?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

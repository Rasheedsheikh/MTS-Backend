import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMerchantDto {
  @IsString() @IsNotEmpty() businessName: string;
  @IsString() @IsNotEmpty() businessOwnerName: string;

  @IsOptional() @IsString() mobileNumber?: string;
  @IsOptional() @IsString() whatsappNumber?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() subcategory?: string;
  @IsOptional() @IsString() shopImage?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() cityName?: string;
  @IsOptional() @IsString() partnerCode?: string;
}

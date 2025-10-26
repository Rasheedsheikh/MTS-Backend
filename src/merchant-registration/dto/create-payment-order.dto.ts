import { IsString, IsOptional } from 'class-validator';

export class CreatePaymentOrderDto {
  @IsString()
  businessName: string;

  @IsString()
  businessOwnerName: string;

  @IsString()
  mobileNumber: string;

  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @IsString()
  category: string;

  @IsString()
  subcategory: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  partnerCode?: string;
}

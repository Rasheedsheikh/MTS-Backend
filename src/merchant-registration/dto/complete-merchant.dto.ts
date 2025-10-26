import { IsString, IsOptional } from 'class-validator';

export class CompleteMerchantDto {
  @IsString()
  orderId: string;

  @IsString()
  paymentId: string;

  @IsString()
  signature: string;

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

  @IsOptional()
  @IsString()
  shopImageUrl?: string;
}

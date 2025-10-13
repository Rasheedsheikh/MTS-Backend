import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MerchantPaymentStatus } from '../merchant-detail.entity';

export class CreateMerchantDetailDto {
	@IsNotEmpty()
	@IsString()
	businessName!: string;

	@IsNotEmpty()
	@IsString()
	businessOwnerName!: string;

	@IsOptional()
	@IsString()
	mobileNumber?: string;

	@IsOptional()
	@IsString()
	whatsappNumber?: string;

	@IsOptional()
	@IsString()
	category?: string;

	@IsOptional()
	@IsString()
	subcategory?: string;

	@IsOptional()
	@IsString()
	shopImage?: string;

	@IsOptional()
	@IsString()
	address?: string;

	@IsOptional()
	@IsString()
	partnerCode?: string;

	// Payment-related fields (optional on create; can be set when initiating payment)
	@IsOptional()
	@IsEnum(MerchantPaymentStatus)
	paymentStatus?: MerchantPaymentStatus;

	@IsOptional()
	@IsString()
	paymentAmount?: string;

	@IsOptional()
	@IsString()
	paymentCurrency?: string;

	@IsOptional()
	@IsString()
	paymentProvider?: string;

	@IsOptional()
	@IsString()
	paymentOrderId?: string;

	@IsOptional()
	@IsString()
	paymentTransactionId?: string;

	@IsOptional()
	@IsString()
	paymentReceiptUrl?: string;
}



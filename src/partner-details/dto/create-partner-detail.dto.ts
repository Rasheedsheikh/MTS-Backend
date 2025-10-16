import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePartnerDetailDto {
	@IsOptional()
	@IsString()
	candidateName?: string;

	@IsOptional()
	@IsString()
	gender?: string;

	@IsOptional()
	@IsString()
	mobile?: string;


		@IsOptional()
	@IsString()
	image?: string;

	@IsOptional()
	@IsString()
	location?: string;

	@IsOptional()
	@IsString()
	fullNameAsPerBank?: string;

	@IsOptional()
	@IsString()
	companyNameOrDob?: string;

	@IsEmail()
	email!: string;

	@IsOptional()
	@IsString()
	altMobile?: string;

	@IsOptional()
	@IsString()
	address?: string;

	@IsNotEmpty()
	@IsString()
	panNumber!: string;

	// Bank details
	@IsOptional()
	@IsString()
	bankAccountNumber?: string;

	@IsOptional()
	@IsString()
	ifscOrSwift?: string; // IFSC Code / SWIFT Code

	@IsOptional()
	@IsString()
	bankNameAndBranch?: string; // Bank Name & Branch

	@IsOptional()
	@IsString()
	upiId?: string; // UPI ID (optional)
}



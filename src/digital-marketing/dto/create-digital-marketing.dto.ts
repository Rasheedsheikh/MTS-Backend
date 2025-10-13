import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateDigitalMarketingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  // @Matches(/^[0-9]{10}$/, { message: 'Mobile number must be 10 digits' })
  mobileNumber: string;

  @IsNotEmpty()
  @IsString()
  socialMedia: string;
}

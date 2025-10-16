import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateFreeBookingDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  number: string;

  @IsString()
  category: string;

  @IsString()
  shop: string;

  @IsString()
  message: string;

  @IsString()
  location: string;

  @IsOptional()
  createdAt?: Date;
}

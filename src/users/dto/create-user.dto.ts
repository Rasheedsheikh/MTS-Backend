import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
	@IsEmail()
	email!: string;

	@IsNotEmpty()
	name!: string;

	@MinLength(8)
	password!: string;

	@IsOptional()
	@IsEnum(UserRole)
	role?: UserRole;
}



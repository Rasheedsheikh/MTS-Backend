import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.usersService.findByEmail(email);
		if (!user) throw new UnauthorizedException('Invalid credentials');
		const isValid = await user.comparePassword(password);
		if (!isValid) throw new UnauthorizedException('Invalid credentials');
		const { passwordHash, ...safe } = user as any;
		return safe;
	}

	async login(email: string, password: string) {
		const user = await this.validateUser(email, password);
		const payload = { sub: user.id, email: user.email, role: user.role };
		return {
			access_token: await this.jwtService.signAsync(payload),
			user,
		};
	}
}



import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	create(@Body() dto: CreateUserDto) {
		return this.usersService.create(dto);
	}

	@Get(':id')
	findOne(@Param('id') user_id: string) {66
    return this.usersService.findPublicById(user_id);
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@Get()
	findAllForAdmins() {
		// Example protected admin-only route
		return { message: 'Admin access granted', users: [] };
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.VENDOR, UserRole.ADMIN)
	@Get('vendor-dashboard')
	getVendorDashboard() {
		// Example route accessible to vendors and admins
		return { message: 'Vendor dashboard data' };
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.MERCHANT, UserRole.ADMIN)
	@Get('merchant-dashboard')
	getMerchantDashboard() {
		// Example route accessible to merchants and admins
		return { message: 'Merchant dashboard data' };
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.USER, UserRole.VENDOR, UserRole.MERCHANT, UserRole.ADMIN)
	@Get('profile')
	getProfile(@Param('id') user_id: string) {
		// Example route accessible to all authenticated users
		return this.usersService.findPublicById(user_id);
	}
}



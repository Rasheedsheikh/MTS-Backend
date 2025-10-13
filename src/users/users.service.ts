import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	findByEmail(email: string): Promise<User | null> {
		return this.usersRepository.findOne({ where: { email: email.toLowerCase() }, select: { user_id: true, email: true, name: true, passwordHash: true, role: true } });
	}

	async create(createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
		const { email, name, password, role } = createUserDto;
		const user = this.usersRepository.create({ email, name, role });
		await user.setPassword(password);
		const saved = await this.usersRepository.save(user);
		const { passwordHash, ...safe } = saved;
		return safe as Omit<User, 'passwordHash'>;
	}

	async findPublicById(user_id: string): Promise<Omit<User, 'passwordHash'> | null> {
		const user = await this.usersRepository.findOne({ where: { user_id } });
		if (!user) return null;
		const { passwordHash, ...safe } = user as any;
		return safe;
	}
}



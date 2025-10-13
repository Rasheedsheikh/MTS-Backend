import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
	USER = 'user',
	VENDOR = 'partner',
	MERCHANT = 'merchant',
	ADMIN = 'admin',
}

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn('uuid')
	user_id!: string;

	@Column({ unique: true })
	email!: string;

	@Column()
	name!: string;

	@Column({ select: false })
	passwordHash!: string;

	@Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
	role!: UserRole;

	
	  @CreateDateColumn()
	  createdAt: Date;
	
	  @UpdateDateColumn()
	  updatedAt: Date;

	@BeforeInsert()
	ensureLowercaseEmail(): void {
		this.email = this.email.toLowerCase();
	}

	async setPassword(plainPassword: string): Promise<void> {
		const saltRounds = 10;
		this.passwordHash = await bcrypt.hash(plainPassword, saltRounds);
	}

	async comparePassword(plainPassword: string): Promise<boolean> {
		return bcrypt.compare(plainPassword, this.passwordHash);
	}
}



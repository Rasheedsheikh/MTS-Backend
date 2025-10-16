import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'partner_details' })
export class PartnerDetail {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ unique: true })
	partnerCode!: string; // e.g., MTSP1

	@Column({ nullable: true })
	candidateName?: string; // Candidate Name

	@Column({ nullable: true })
	gender?: string;

	@Column({ nullable: true })
	mobile?: string;

	@Column({ nullable: true })
	location?: string;

	@Column({ nullable: true })
	image?: string; 

	@Column({ nullable: true })
	fullNameAsPerBank?: string; // Full Name (as per bank)

	@Column({ nullable: true })
	companyNameOrDob?: string; // Date of Birth or Company Name (stored as string)

	@Column({ nullable: true, unique: true })
	email?: string; // Email

	@Column({ nullable: true })
	altMobile?: string; // Secondary Mobile (if needed)

	@Column({ nullable: true, type: 'text' })
	address?: string; // Address

	@Column({ nullable: true, unique: true })
	panNumber?: string; // PAN Number (India) 

	// Bank details
	@Column({ nullable: true })
	bankAccountNumber?: string;

	@Column({ nullable: true })
	ifscOrSwift?: string; // IFSC Code / SWIFT Code

	@Column({ nullable: true })
	bankNameAndBranch?: string; // Bank Name & Branch

	@Column({ nullable: true })
	upiId?: string; // Optional UPI ID

	@BeforeInsert()
	@BeforeUpdate()
	normalizeFields(): void {
		if (this.email) this.email = this.email.trim().toLowerCase();
		if (this.panNumber) this.panNumber = this.panNumber.trim().toUpperCase();
	}
}



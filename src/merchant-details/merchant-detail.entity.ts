import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum MerchantPaymentStatus {
	PENDING = 'pending',
	PAID = 'paid',
	FAILED = 'failed',
	REFUNDED = 'refunded',
}

@Entity({ name: 'merchant_details' })
export class MerchantDetail {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	businessName!: string;

	@Column()
	businessOwnerName!: string;

	@Column({ nullable: true })
	mobileNumber?: string;

	@Column({ nullable: true })
	whatsappNumber?: string;

	@Column({ nullable: true })
	category?: string;

	@Column({ nullable: true })
	subcategory?: string;

	@Column({ nullable: true })
	shopImage?: string; // URL to image

	@Column({ nullable: true, type: 'text' })
	address?: string;

	@Column({ nullable: true })
	partnerCode?: string; // foreign key by code string to PartnerDetail.partnerCode

	// Payment-related fields
	@Column({ type: 'enum', enum: MerchantPaymentStatus, default: MerchantPaymentStatus.PENDING })
	paymentStatus!: MerchantPaymentStatus;

	@Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
	paymentAmount?: string;

	@Column({ nullable: true })
	paymentCurrency?: string; // e.g., INR

	@Column({ nullable: true })
	paymentProvider?: string; // e.g., razorpay, stripe

	@Column({ nullable: true })
	paymentOrderId?: string;

	@Column({ nullable: true })
	paymentTransactionId?: string;

	@Column({ nullable: true })
	paymentReceiptUrl?: string;

	@Column({ type: 'timestamptz', nullable: true })
	paymentCreatedAt?: Date;

	@Column({ type: 'timestamptz', nullable: true })
	paymentPaidAt?: Date;

	// Plan fields (1-year subscription)
	@Column({ type: 'date', nullable: true })
	planStartDate?: string;

	@Column({ type: 'date', nullable: true })
	planEndDate?: string;

	@BeforeInsert()
	@BeforeUpdate()
	normalize(): void {
		if (this.paymentCurrency) this.paymentCurrency = this.paymentCurrency.toUpperCase();
		if (this.partnerCode) this.partnerCode = this.partnerCode.trim().toUpperCase();
	}
}



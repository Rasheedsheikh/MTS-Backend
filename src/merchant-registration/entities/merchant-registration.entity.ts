import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PartnerDetail } from 'src/partner-details/partner-detail.entity';

@Entity('merchant_registration')
export class MerchantRegistration {
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
  cityName?: string;

  @Column({ nullable: true })
  partnerCode?: string; // FK to PartnerDetail.partnerCode

  // Payment related fields
  @Column({ nullable: true })
  razorpayOrderId?: string;

  @Column({ nullable: true })
  razorpayPaymentId?: string;

  @Column({ nullable: true })
  razorpaySignature?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 2.00 })
  amount?: number;

  @Column({ default: 'pending' })
  paymentStatus?: 'pending' | 'completed' | 'failed';

  @Column({ default: false })
  isPaymentCompleted?: boolean;

  // optional relation (not mandatory)
  @ManyToOne(() => PartnerDetail, partner => partner.merchants, { nullable: true })
  @JoinColumn({ name: 'partnerCode', referencedColumnName: 'partnerCode' })
  partner?: PartnerDetail;

  // Timestamps
  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  
}

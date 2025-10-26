import { IsOptional } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('advertisement_registration')
export class AdvertisementRegistration {
  @PrimaryGeneratedColumn('uuid', { name: 'advertisement_id' }) // ✅ custom column name
  advertisement_registartion_id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  mobileNumber: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date | null;

  @Column(({ nullable: true }))
  sliderType: string;

  // Payment related fields
  @Column({ nullable: true })
  razorpayOrderId: string;

  @Column({ nullable: true })
  razorpayPaymentId: string;

  @Column({ nullable: true })
  razorpaySignature: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1.00 })
  amount: number;

  @Column({ default: 'pending' })
  paymentStatus: 'pending' | 'completed' | 'failed';

  @Column({ default: false })
  isPaymentCompleted: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class DigitalMarketing {
  @PrimaryGeneratedColumn('uuid')
  id: string; // ✅ Auto-generated UUID

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  mobileNumber: string;

  @Column({ nullable: false })
  socialMedia: string;

  @CreateDateColumn()
  createdAt: Date;
}

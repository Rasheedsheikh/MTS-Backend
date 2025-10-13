import { IsOptional } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('advertisements')
export class Advertisement {
  @PrimaryGeneratedColumn('uuid', { name: 'advertisement_id' }) // ✅ custom column name
  advertisement_id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

    @Column(({ nullable: true }))
  sliderType: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

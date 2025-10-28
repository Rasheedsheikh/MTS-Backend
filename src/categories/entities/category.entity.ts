import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  category_id: string;

  @Column({ unique: true })
  category_name: string;

  @Column({ nullable: true })
  category_image: string; // URL to image

  @CreateDateColumn({ name: 'created_on' })
  created_on: Date;
}


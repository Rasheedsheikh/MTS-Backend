import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { S3Module } from '../common/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), S3Module],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService], // Export if other modules need to use it
})
export class CategoriesModule {}

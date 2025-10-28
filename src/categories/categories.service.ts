import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { S3Service } from '../common/s3.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly s3Service: S3Service,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, file?: Express.Multer.File): Promise<Category> {
    let category_image = createCategoryDto.category_image;

    // Upload to S3 if file exists
    if (file) {
      const key = `categories/${Date.now()}-${file.originalname}`;
      category_image = await this.s3Service.uploadObject({
        key,
        body: file.buffer,
        contentType: file.mimetype,
      });
    }

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      category_image,
    });
    
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      order: { created_on: 'DESC' },
    });
  }

  async findOne(category_id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ 
      where: { category_id } 
    });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${category_id} not found`);
    }
    
    return category;
  }

  async update(category_id: string, updateCategoryDto: UpdateCategoryDto, file?: Express.Multer.File): Promise<Category> {
    const category = await this.findOne(category_id);
    
    // Upload to S3 if file exists
    if (file) {
      const key = `categories/${Date.now()}-${file.originalname}`;
      const category_image = await this.s3Service.uploadObject({
        key,
        body: file.buffer,
        contentType: file.mimetype,
      });
      category.category_image = category_image;
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(category_id: string): Promise<{ message: string }> {
    const category = await this.findOne(category_id);
    await this.categoryRepository.remove(category);
    
    return { message: `Category with ID ${category_id} deleted successfully` };
  }
}


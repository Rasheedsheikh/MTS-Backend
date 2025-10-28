import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('categoryImage'))
  create(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile() file?: Express.Multer.File) {
    return this.categoriesService.create(createCategoryDto, file);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':category_id')
  findOne(@Param('category_id', ParseUUIDPipe) category_id: string) {
    return this.categoriesService.findOne(category_id);
  }

  @Patch(':category_id')
  @UseInterceptors(FileInterceptor('categoryImage'))
  update(
    @Param('category_id', ParseUUIDPipe) category_id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.categoriesService.update(category_id, updateCategoryDto, file);
  }

  @Delete(':category_id')
  remove(@Param('category_id', ParseUUIDPipe) category_id: string) {
    return this.categoriesService.remove(category_id);
  }
}


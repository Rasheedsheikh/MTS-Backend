import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PartnerDetailsService } from './partner-details.service';
import { CreatePartnerDetailDto } from './dto/create-partner-detail.dto';
import { UpdatePartnerDetailDto } from './dto/update-partner-detail.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('partner-details')
export class PartnerDetailsController {
  constructor(private readonly service: PartnerDetailsService) {}

  // ✅ Create Partner Detail with optional image upload to S3
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreatePartnerDetailDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.service.create(dto, file);
  }

  // ✅ Get all Partner Details
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ✅ Get Partner Detail by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ✅ Update Partner Detail
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePartnerDetailDto) {
    return this.service.update(id, dto);
  }

  // ✅ Delete Partner Detail
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  
}

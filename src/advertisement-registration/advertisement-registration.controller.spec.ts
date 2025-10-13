import { Controller, Get, Post, Body, Param, Patch, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdvertisementRegistrationService } from './advertisement-registration.service';
import { CreateAdvertisementRegistrationDto } from './dto/create-advertisement-registration.dto';
import { UpdateAdvertisementRegistrationDto } from './dto/update-advertisement-registration.dto';

@Controller('advertisement-registration')
export class AdvertisementsController {
  constructor(private readonly adsService: AdvertisementRegistrationService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() dto: CreateAdvertisementRegistrationDto, @UploadedFile() file?: Express.Multer.File) {
    return this.adsService.create(dto, file);
  }

  @Get()
  findAll() {
    return this.adsService.findAll();
  }

  @Get(':advertisement_id')
  findOne(@Param('advertisement_id') advertisement_id: string) {
    return this.adsService.findOne(advertisement_id);
  }

  @Patch(':advertisement_id')
  update(
    @Param('advertisement_id') advertisement_id: string,
    @Body() dto: UpdateAdvertisementRegistrationDto,
  ) {
    return this.adsService.update(advertisement_id, dto);
  }

  @Delete(':advertisement_id')
  remove(@Param('advertisement_id') advertisement_id: string) {
    return this.adsService.remove(advertisement_id);
  }
}

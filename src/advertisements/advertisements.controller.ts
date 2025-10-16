import { Controller, Get, Post, Body, Param, Patch, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdvertisementsService } from './advertisements.service';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';

@Controller('advertisements')
export class AdvertisementsController {
  constructor(private readonly adsService: AdvertisementsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() dto: CreateAdvertisementDto, @UploadedFile() file?: Express.Multer.File) {
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
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('advertisement_id') advertisement_id: string,
    @Body() dto: UpdateAdvertisementDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.adsService.update(advertisement_id, dto, file);
  }

  @Delete(':advertisement_id')
  remove(@Param('advertisement_id') advertisement_id: string) {
    return this.adsService.remove(advertisement_id);
  }
}

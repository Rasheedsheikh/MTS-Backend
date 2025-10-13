import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdvertisementRegistrationService } from './advertisement-registration.service';
import { CreateAdvertisementRegistrationDto } from './dto/create-advertisement-registration.dto';
import { UpdateAdvertisementRegistrationDto } from './dto/update-advertisement-registration.dto';

@Controller('advertisement-registration')
export class AdvertisementRegistrationController {
  constructor(private readonly advertisementRegistrationService: AdvertisementRegistrationService) {}

  @Post()
  create(@Body() createAdvertisementRegistrationDto: CreateAdvertisementRegistrationDto) {
    return this.advertisementRegistrationService.create(createAdvertisementRegistrationDto);
  }

  @Get()
  findAll() {
    return this.advertisementRegistrationService.findAll();
  }

@Get(':advertisement_registration_id')
  findOne(@Param('advertisement_id') advertisement_registration_id: string) {
    return this.advertisementRegistrationService.findOne(advertisement_registration_id);
  }

  @Patch(':advertisement_registration_id')
  update(
    @Param('advertisement_registration_id') advertisement_registration_id: string,
    @Body() dto: UpdateAdvertisementRegistrationDto,
  ) {
    return this.advertisementRegistrationService.update(advertisement_registration_id, dto);
  }

  @Delete(':advertisement_registration_id')
  remove(@Param('advertisement_registration_id') advertisement_registration_id: string) {
    return this.advertisementRegistrationService.remove(advertisement_registration_id);
  }
}

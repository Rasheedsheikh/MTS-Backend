import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AdvertisementRegistrationService } from './advertisement-registration.service';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';
import { CompleteAdvertisementDto } from './dto/complete-advertisement.dto';
import { UpdateAdvertisementRegistrationDto } from './dto/update-advertisement-registration.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('advertisement-registration')
export class AdvertisementRegistrationController {
  constructor(private readonly advertisementRegistrationService: AdvertisementRegistrationService) {}

  // Step 1: Create payment order (don't create advertisement yet)
  @Post('create-payment-order')
  createPaymentOrder(@Body() dto: CreatePaymentOrderDto) {
    return this.advertisementRegistrationService.createPaymentOrder(dto);
  }

  // Step 2: Complete advertisement after successful payment
  @Post('complete-advertisement')
  @UseInterceptors(FileInterceptor('image'))
  completeAdvertisement(
    @Body() completeDto: CompleteAdvertisementDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.advertisementRegistrationService.completeAdvertisement(completeDto, file);
  }

  // Alternative: Complete advertisement with form data (for frontend convenience)
  @Post('complete-with-form-data')
  @UseInterceptors(FileInterceptor('image'))
  completeAdvertisementWithFormData(
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File
  ) {
    const { formData, paymentData } = body;
    return this.advertisementRegistrationService.completeAdvertisementWithFormData(formData, paymentData, file);
  }

  @Get()
  findAll() {
    return this.advertisementRegistrationService.findAll();
  }

  @Get(':advertisement_registration_id')
  findOne(@Param('advertisement_registration_id') advertisement_registration_id: string) {
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

import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MerchantRegistrationService } from './merchant-registration.service';
import { CreateMerchantDto } from './dto/create-merchant-registration.dto';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';
import { CompleteMerchantDto } from './dto/complete-merchant.dto';

@Controller('merchant-registration')
export class MerchantRegistrationController {
  constructor(private readonly service: MerchantRegistrationService) {}

  // Step 1: Create payment order (don't create merchant yet)
  @Post('create-payment-order')
  createPaymentOrder(@Body() dto: CreatePaymentOrderDto) {
    return this.service.createPaymentOrder(dto);
  }

  // Step 2: Complete registration after successful payment
  @Post('complete-registration')
  @UseInterceptors(FileInterceptor('shopImage'))
  async completeRegistration(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    try {
      console.log('🔍 Received complete registration request');
      console.log('🔍 Body keys:', Object.keys(body));
      console.log('🔍 File:', file ? `Present: ${file.originalname}` : 'Not present');
      
      // Parse the FormData into DTO
      const completeDto: CompleteMerchantDto = {
        orderId: body.orderId,
        paymentId: body.paymentId,
        signature: body.signature,
        businessName: body.businessName,
        businessOwnerName: body.businessOwnerName,
        mobileNumber: body.mobileNumber,
        whatsappNumber: body.whatsappNumber || '',
        category: body.category,
        subcategory: body.subcategory,
        address: body.address,
        partnerCode: body.partnerCode || '',
        shopImageUrl: body.shopImageUrl || '',
      };
      
      console.log('🔍 Parsed DTO:', completeDto);
      
      return await this.service.completeRegistration(completeDto, file);
    } catch (error) {
      console.error('❌ Error in completeRegistration:', error);
      throw error;
    }
  }

  // Old create endpoint (kept for backward compatibility)
  @Post('create')
  @UseInterceptors(FileInterceptor('shopImage'))
  create(@Body() dto: CreateMerchantDto, @UploadedFile() file?: Express.Multer.File) {
    return this.service.create(dto, file);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('partner-codes')
  getPartnerCodes() {
    return this.service.getPartnerCodes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateMerchantDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

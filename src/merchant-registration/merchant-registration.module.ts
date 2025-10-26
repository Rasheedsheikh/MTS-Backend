import { Module } from '@nestjs/common';
import { MerchantRegistrationService } from './merchant-registration.service';
import { MerchantRegistrationController } from './merchant-registration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { MerchantRegistration } from './entities/merchant-registration.entity';
import { PartnerDetail } from 'src/partner-details/partner-detail.entity';
import { S3Service } from 'src/common/s3.service';
import { RazorpayService } from 'src/common/razorpay.service';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantRegistration, PartnerDetail])],
  controllers: [MerchantRegistrationController],
  providers: [MerchantRegistrationService, PaymentService, S3Service, RazorpayService],
})
export class MerchantRegistrationModule {}

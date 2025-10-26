import { Module } from '@nestjs/common';
import { AdvertisementRegistrationService } from './advertisement-registration.service';
import { AdvertisementRegistrationController } from './advertisement-registration.controller';
import { S3Module } from 'src/common/s3.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertisementRegistration } from './entities/advertisement-registration.entity';
import { RazorpayService } from 'src/common/razorpay.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdvertisementRegistration]), S3Module],
  controllers: [AdvertisementRegistrationController],
  providers: [AdvertisementRegistrationService, RazorpayService],
})
export class AdvertisementRegistrationModule {}

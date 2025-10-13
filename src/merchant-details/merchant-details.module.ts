import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantDetail } from './merchant-detail.entity';
import { MerchantDetailsService } from './merchant-details.service';
import { MerchantDetailsController } from './merchant-details.controller';
import { S3Service } from '../common/s3.service';
import { PartnerDetailsService } from '../partner-details/partner-details.service';
import { PartnerDetail } from 'src/partner-details/partner-detail.entity';

@Module({
	imports: [TypeOrmModule.forFeature([MerchantDetail, PartnerDetail])],
    controllers: [MerchantDetailsController],
    providers: [MerchantDetailsService, S3Service,PartnerDetailsService],
})
export class MerchantDetailsModule {}



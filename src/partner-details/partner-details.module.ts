import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerDetail } from './partner-detail.entity';
import { PartnerDetailsService } from './partner-details.service';
import { PartnerDetailsController } from './partner-details.controller';

import { S3Module } from 'src/common/s3.module';

@Module({
	imports: [TypeOrmModule.forFeature([PartnerDetail]), S3Module],
	controllers: [PartnerDetailsController],
	providers: [PartnerDetailsService],
})
export class PartnerDetailsModule {}



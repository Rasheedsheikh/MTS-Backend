import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerDetail } from './partner-detail.entity';
import { PartnerDetailsService } from './partner-details.service';
import { PartnerDetailsController } from './partner-details.controller';

@Module({
	imports: [TypeOrmModule.forFeature([PartnerDetail])],
	controllers: [PartnerDetailsController],
	providers: [PartnerDetailsService],
})
export class PartnerDetailsModule {}



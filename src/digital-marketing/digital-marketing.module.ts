import { Module } from '@nestjs/common';
import { DigitalMarketingService } from './digital-marketing.service';
import { DigitalMarketingController } from './digital-marketing.controller';
import { DigitalMarketing } from './entities/digital-marketing.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DigitalMarketing])],
  controllers: [DigitalMarketingController],
  providers: [DigitalMarketingService],
})
export class DigitalMarketingModule {}

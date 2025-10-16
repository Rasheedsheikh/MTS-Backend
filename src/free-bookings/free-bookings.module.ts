import { Module } from '@nestjs/common';
import { FreeBookingsService } from './free-bookings.service';
import { FreeBookingsController } from './free-bookings.controller';
import { FreeBooking } from './entities/free-booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([FreeBooking])],
  controllers: [FreeBookingsController],
  providers: [FreeBookingsService],
})
export class FreeBookingsModule {}

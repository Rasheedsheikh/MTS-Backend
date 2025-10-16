import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { FreeBookingsService} from './free-bookings.service';
import { FreeBooking} from './entities/free-booking.entity';

@Controller('free-bookings')
export class FreeBookingsController {
  constructor(private readonly FreeBookingsService: FreeBookingsService) {}

  @Post()
  create(@Body() body: Partial<FreeBooking>) {
    return this.FreeBookingsService.create(body);
  }

  @Get()
  findAll() {
    return this.FreeBookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.FreeBookingsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: Partial<FreeBooking>) {
    return this.FreeBookingsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.FreeBookingsService.remove(id);
  }
}

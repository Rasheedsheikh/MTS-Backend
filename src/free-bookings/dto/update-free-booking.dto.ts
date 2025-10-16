import { PartialType } from '@nestjs/mapped-types';
import { CreateFreeBookingDto } from './create-free-booking.dto';

export class UpdateFreeBookingDto extends PartialType(CreateFreeBookingDto) {}

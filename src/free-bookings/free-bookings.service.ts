import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FreeBooking } from './entities/free-booking.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class FreeBookingsService {
  constructor(
    @InjectRepository(FreeBooking)
    private readonly FreeBookingRepository: Repository<FreeBooking>,
    private readonly mailerService: MailerService,
  ) {}

  // Create
async create(freeBookingData: Partial<FreeBooking>) {
  const freeBooking = this.FreeBookingRepository.create(freeBookingData);
  const savedFreeBooking = await this.FreeBookingRepository.save(freeBooking);

  try {
    await this.mailerService.sendMail({
      to: 'rasheedsheikh9786@gmail.com', // 👈 your target email
      subject: `New Free Booking from ${savedFreeBooking.name}`,
      html: `
        <h2>New Booking Received</h2>
        <p><strong>Name:</strong> ${savedFreeBooking.name}</p>
        <p><strong>Email:</strong> ${savedFreeBooking.email}</p>
        <p><strong>Number:</strong> ${savedFreeBooking.number}</p>
        <p><strong>Category:</strong> ${savedFreeBooking.category}</p>
        <p><strong>Shop:</strong> ${savedFreeBooking.shop}</p>
        <p><strong>Message:</strong> ${savedFreeBooking.message}</p>
        <p><strong>Location:</strong> ${savedFreeBooking.location}</p>
      `,
    });

    // ✅ Return a success message along with the saved data
    return {
      success: true,
      message: 'Booking successfully registered and email sent!',
      data: savedFreeBooking,
    };

  } catch (error) {
    console.error('❌ Error sending email:', error.message);

    // Return success for booking but error message for email
    return {
      success: false,
      message: 'Booking saved, but email sending failed.',
      data: savedFreeBooking,
    };
  }
}


  // Find all
  findAll(): Promise<FreeBooking[]> {
    return this.FreeBookingRepository.find();
  }

  // Find one
// Find one
async findOne(id: number): Promise<FreeBooking> {
  const record = await this.FreeBookingRepository.findOneBy({ id });
  if (!record) {
    throw new Error(`FreeBooking with ID ${id} not found`);
  }
  return record;
}




  // Update
  async update(id: number, data: Partial<FreeBooking >): Promise<FreeBooking> {
    await this.FreeBookingRepository.update(id, data);
    return this.findOne(id);
  }

  // Delete
  async remove(id: number): Promise<void> {
    await this.FreeBookingRepository.delete(id);
  }
}

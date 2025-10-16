import { Test, TestingModule } from '@nestjs/testing';
import { FreeBookingsController } from './free-bookings.controller';
import { FreeBookingsService } from './free-bookings.service';

describe('FreeBookingsController', () => {
  let controller: FreeBookingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreeBookingsController],
      providers: [FreeBookingsService],
    }).compile();

    controller = module.get<FreeBookingsController>(FreeBookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

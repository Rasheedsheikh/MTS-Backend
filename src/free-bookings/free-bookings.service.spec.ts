import { Test, TestingModule } from '@nestjs/testing';
import { FreeBookingsService } from './free-bookings.service';

describe('FreeBookingsService', () => {
  let service: FreeBookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreeBookingsService],
    }).compile();

    service = module.get<FreeBookingsService>(FreeBookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

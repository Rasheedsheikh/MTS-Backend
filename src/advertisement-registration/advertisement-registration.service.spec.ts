import { Test, TestingModule } from '@nestjs/testing';
import { AdvertisementRegistrationService } from './advertisement-registration.service';

describe('AdvertisementRegistrationService', () => {
  let service: AdvertisementRegistrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvertisementRegistrationService],
    }).compile();

    service = module.get<AdvertisementRegistrationService>(AdvertisementRegistrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

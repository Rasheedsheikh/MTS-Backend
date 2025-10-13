import { Test, TestingModule } from '@nestjs/testing';
import { DigitalMarketingService } from './digital-marketing.service';

describe('DigitalMarketingService', () => {
  let service: DigitalMarketingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DigitalMarketingService],
    }).compile();

    service = module.get<DigitalMarketingService>(DigitalMarketingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

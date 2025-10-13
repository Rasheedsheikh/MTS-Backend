import { Test, TestingModule } from '@nestjs/testing';
import { DigitalMarketingController } from './digital-marketing.controller';
import { DigitalMarketingService } from './digital-marketing.service';

describe('DigitalMarketingController', () => {
  let controller: DigitalMarketingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DigitalMarketingController],
      providers: [DigitalMarketingService],
    }).compile();

    controller = module.get<DigitalMarketingController>(DigitalMarketingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MerchantRegistrationController } from './merchant-registration.controller';
import { MerchantRegistrationService } from './merchant-registration.service';

describe('MerchantRegistrationController', () => {
  let controller: MerchantRegistrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantRegistrationController],
      providers: [MerchantRegistrationService],
    }).compile();

    controller = module.get<MerchantRegistrationController>(MerchantRegistrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

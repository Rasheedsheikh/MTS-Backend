import { PartialType } from '@nestjs/mapped-types';
import { CreateMerchantDto } from './create-merchant-registration.dto';

export class UpdateMerchantDto extends PartialType(CreateMerchantDto) {}

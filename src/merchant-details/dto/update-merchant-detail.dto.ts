import { PartialType } from '@nestjs/mapped-types';
import { CreateMerchantDetailDto } from './create-merchant-detail.dto';

export class UpdateMerchantDetailDto extends PartialType(CreateMerchantDetailDto) {}



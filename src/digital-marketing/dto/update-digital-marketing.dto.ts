import { PartialType } from '@nestjs/mapped-types';
import { CreateDigitalMarketingDto } from './create-digital-marketing.dto';

export class UpdateDigitalMarketingDto extends PartialType(CreateDigitalMarketingDto) {}

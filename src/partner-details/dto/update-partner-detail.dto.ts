import { PartialType } from '@nestjs/mapped-types';
import { CreatePartnerDetailDto } from './create-partner-detail.dto';

export class UpdatePartnerDetailDto extends PartialType(CreatePartnerDetailDto) {}



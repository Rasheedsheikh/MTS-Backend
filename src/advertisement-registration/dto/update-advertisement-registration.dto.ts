import { PartialType } from '@nestjs/mapped-types';
import { CreateAdvertisementRegistrationDto } from './create-advertisement-registration.dto';

export class UpdateAdvertisementRegistrationDto extends PartialType(CreateAdvertisementRegistrationDto) {}

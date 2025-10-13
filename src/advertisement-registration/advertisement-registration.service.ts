import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdvertisementRegistration } from './entities/advertisement-registration.entity';
import { CreateAdvertisementRegistrationDto } from './dto/create-advertisement-registration.dto';
import { UpdateAdvertisementRegistrationDto } from './dto/update-advertisement-registration.dto';
import { S3Service } from '../common/s3.service'; // if using S3
import { Advertisement } from 'src/advertisements/entities/advertisement.entity';

@Injectable()
export class AdvertisementRegistrationService {
  constructor(
    @InjectRepository(AdvertisementRegistration)
    private readonly adRepository: Repository<Advertisement>,
    private readonly s3Service: S3Service, // optional for uploads
  ) {}

  async create(dto: CreateAdvertisementRegistrationDto, file?: Express.Multer.File) {
    let imageUrl = dto.imageUrl;

    // ✅ Upload to S3 if file exists
    if (file) {
      const key = `advertisements/${Date.now()}-${file.originalname}`;
      imageUrl = await this.s3Service.uploadObject({
        key,
        body: file.buffer,
        contentType: file.mimetype,
      });
    }

    const ad = this.adRepository.create({ ...dto, imageUrl });
    return await this.adRepository.save(ad);
  }

  async findAll() {
    return this.adRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(advertisement_id: string) {
    const ad = await this.adRepository.findOne({ where: { advertisement_id } });
    if (!ad) throw new NotFoundException(`Advertisement with ID ${advertisement_id} not found`);
    return ad;
  }

  async update(advertisement_id: string, dto: UpdateAdvertisementRegistrationDto) {
    const ad = await this.findOne(advertisement_id);
    Object.assign(ad, dto);
    return this.adRepository.save(ad);
  }

  async remove(advertisement_id: string) {
    const ad = await this.findOne(advertisement_id);

    // ✅ Optional: Delete from S3
    // await this.s3Service.deleteObject(ad.imageUrl);

    await this.adRepository.remove(ad);
    return { message: `Advertisement ${advertisement_id} deleted successfully` };
  }
}

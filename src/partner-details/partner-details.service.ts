import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnerDetail } from './partner-detail.entity';
import { CreatePartnerDetailDto } from './dto/create-partner-detail.dto';
import { UpdatePartnerDetailDto } from './dto/update-partner-detail.dto';
import { S3Service } from '../common/s3.service'; // ✅ Import your S3 service

@Injectable()
export class PartnerDetailsService {
  constructor(
    @InjectRepository(PartnerDetail)
    private readonly repo: Repository<PartnerDetail>,
    private readonly s3Service: S3Service, // ✅ Inject S3 service
  ) {}

async create(dto: CreatePartnerDetailDto, file?: Express.Multer.File) {
  return this.repo.manager.transaction(async (em) => {
    try {
      let imageUrl: string | undefined;

      if (file) {
        // ✅ Prepare S3 upload parameters
        const key = `partner-images/${Date.now()}-${file.originalname}`;

        imageUrl = await this.s3Service.uploadObject({
          key,
          body: file.buffer,
          contentType: file.mimetype,
        });
      }

      const count = await em.count(PartnerDetail);
      const nextNumber = count + 1;
      const partnerCode = `MTSP${String(nextNumber).padStart(4, '0')}`;

      const entity = em.create(PartnerDetail, {
        ...dto,
        partnerCode,
        image: imageUrl, // ✅ Save S3 image URL
      });

      return await em.save(entity);
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new ConflictException('Email or PAN already exists');
      }
      throw error;
    }
  });
}


  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Partner detail not found');
    return found;
  }

  async update(id: string, dto: UpdatePartnerDetailDto) {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    try {
      return await this.repo.save(entity);
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new ConflictException('Email or PAN already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { id };
  }

  
}

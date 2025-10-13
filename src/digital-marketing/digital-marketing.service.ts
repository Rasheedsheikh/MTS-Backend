import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDigitalMarketingDto } from './dto/create-digital-marketing.dto';
import { UpdateDigitalMarketingDto } from './dto/update-digital-marketing.dto';
import { DigitalMarketing } from './entities/digital-marketing.entity';

@Injectable()
export class DigitalMarketingService {
  constructor(
    @InjectRepository(DigitalMarketing)
    private repo: Repository<DigitalMarketing>,
  ) {}

  create(dto: CreateDigitalMarketingDto) {
    const record = this.repo.create(dto);
    return this.repo.save(record); // UUID generated automatically
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Record not found');
    return record;
  }

  async update(id: string, dto: UpdateDigitalMarketingDto) {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return this.repo.save(record);
  }

  async remove(id: string) {
    const record = await this.findOne(id);
    await this.repo.remove(record);
    return { message: 'Record deleted successfully' };
  }
}

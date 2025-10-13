import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnerDetail } from './partner-detail.entity';
import { CreatePartnerDetailDto } from './dto/create-partner-detail.dto';
import { UpdatePartnerDetailDto } from './dto/update-partner-detail.dto';

@Injectable()
export class PartnerDetailsService {
	constructor(
		@InjectRepository(PartnerDetail)
		private readonly repo: Repository<PartnerDetail>,
	) {}

	create(dto: CreatePartnerDetailDto) {
		return this.repo.manager.transaction(async (em) => {
			try {
				const count = await em.count(PartnerDetail);
				const nextNumber = count + 1;
				const partnerCode = `MTSP${String(nextNumber).padStart(4, '0')}`;
				const entity = em.create(PartnerDetail, { ...dto, partnerCode });
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



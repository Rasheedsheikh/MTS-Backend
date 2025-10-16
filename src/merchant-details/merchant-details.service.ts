import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantDetail, MerchantPaymentStatus } from './merchant-detail.entity';
import { PartnerDetail } from '../partner-details/partner-detail.entity';
import { CreateMerchantDetailDto } from './dto/create-merchant-detail.dto';
import { UpdateMerchantDetailDto } from './dto/update-merchant-detail.dto';
import { S3Service } from 'src/common/s3.service';

@Injectable()
export class MerchantDetailsService {
	constructor(
		@InjectRepository(MerchantDetail)
		private readonly repo: Repository<MerchantDetail>,
		@InjectRepository(PartnerDetail)
		private readonly partnerRepo: Repository<PartnerDetail>,
		private readonly s3Service: S3Service,
	) {}

	// async create(dto: CreateMerchantDetailDto) {
	// 	if (dto.partnerCode) {
	// 		const partner = await this.partnerRepo.findOne({ where: { partnerCode: dto.partnerCode.trim().toUpperCase() } });
	// 		if (!partner) {
	// 			throw new NotFoundException('Invalid partnerCode');
	// 		}
	// 	}
	// 	const entity = this.repo.create({
	// 		...dto,
	// 		paymentStatus: dto.paymentStatus ?? MerchantPaymentStatus.PENDING,
	// 	});
	// 	return this.repo.save(entity);
	// }

	findAll() {
		return this.repo.find();
	}

	async findOne(id: string) {
		const found = await this.repo.findOne({ where: { id } });
		if (!found) throw new NotFoundException('Merchant not found');
		return found;
	}

	async update(id: string, dto: UpdateMerchantDetailDto) {
		if (dto.partnerCode) {
			const partner = await this.partnerRepo.findOne({ where: { partnerCode: dto.partnerCode.trim().toUpperCase() } });
			if (!partner) {
				throw new NotFoundException('Invalid partnerCode');
			}
		}
		const entity = await this.findOne(id);
		Object.assign(entity, dto);
		return this.repo.save(entity);
	}

	async remove(id: string) {
		await this.findOne(id);
		await this.repo.delete(id);
		return { id };
	}

	// Payment flows (stubs for integration)
	async initiatePayment(id: string, amount: string, currency = 'INR', provider = 'razorpay') {
		const merchant = await this.findOne(id);
		merchant.paymentStatus = MerchantPaymentStatus.PENDING;
		merchant.paymentAmount = amount;
		merchant.paymentCurrency = currency;
		merchant.paymentProvider = provider;
		merchant.paymentCreatedAt = new Date();
		// provider-specific: create order and set merchant.paymentOrderId
		return this.repo.save(merchant);
	}

	async confirmPayment(id: string, transactionId: string, receiptUrl?: string) {
		const merchant = await this.findOne(id);
		merchant.paymentStatus = MerchantPaymentStatus.PAID;
		merchant.paymentTransactionId = transactionId;
		merchant.paymentReceiptUrl = receiptUrl;
		merchant.paymentPaidAt = new Date();
		// set plan dates for 1-year
		const start = new Date();
		const end = new Date(start);
		end.setFullYear(start.getFullYear() + 1);
		merchant.planStartDate = start.toISOString().slice(0, 10);
		merchant.planEndDate = end.toISOString().slice(0, 10);
		return this.repo.save(merchant);
	}


	 async create(dto: CreateMerchantDetailDto, file?: Express.Multer.File) {
		let shopImage = dto.shopImage;
	
		// ✅ Upload to S3 if file exists
		if (file) {
		  const key = `advertisements/${Date.now()}-${file.originalname}`;
		  shopImage = await this.s3Service.uploadObject({
			key,
			body: file.buffer,
			contentType: file.mimetype,
		  });
		}
	
		const merchant = this.repo.create({ ...dto, shopImage });
		return await this.repo.save(merchant);
	  }

	  // merchant-details.service.ts

async getCategoriesAndShopNames() {
  const merchants = await this.repo.find({
    select: ['category', 'businessName'],
  });

  // Extract unique categories and shop names
  const categories = [...new Set(merchants.map((m) => m.category).filter(Boolean))];
  const shopNames = [...new Set(merchants.map((m) => m.businessName).filter(Boolean))];

  return { categories, shopNames };
}

}





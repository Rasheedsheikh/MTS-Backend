import { Body, Controller, Delete, Get,  Param, Patch, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import { MerchantDetailsService } from './merchant-details.service';
import { CreateMerchantDetailDto } from './dto/create-merchant-detail.dto';
import { UpdateMerchantDetailDto } from './dto/update-merchant-detail.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../common/s3.service';

@Controller('merchant-details')
export class MerchantDetailsController {
	constructor(private readonly service: MerchantDetailsService, private readonly s3: S3Service) {}




	  @Post('add-service')
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() dto: CreateMerchantDetailDto, @UploadedFile() file?: Express.Multer.File) {
    return this.service.create(dto, file);
  }

	@Get()
	findAll() {
		return this.service.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.service.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() dto: UpdateMerchantDetailDto) {
		return this.service.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.service.remove(id);
	}

	// Payment endpoints
	@Post(':id/payments/initiate')
	initiatePayment(
		@Param('id') id: string,
		@Body() body: { amount: string; currency?: string; provider?: string },
	) {
		return this.service.initiatePayment(id, body.amount, body.currency, body.provider);
	}

	@Post(':id/payments/confirm')
	confirmPayment(
		@Param('id') id: string,
		@Body() body: { transactionId: string; receiptUrl?: string },
	) {
		return this.service.confirmPayment(id, body.transactionId, body.receiptUrl);
	}

	// Image upload -> S3
	@Post(':id/shop-image')
	@UseInterceptors(FileInterceptor('file'))
	uploadShopImage(
		@Param('id') id: string,
		@UploadedFile() file: Express.Multer.File,
	) {
		const key = `merchant-shops/${id}/${Date.now()}-${file.originalname}`;
		return this.s3.uploadObject({ key, body: file.buffer, contentType: file.mimetype }).then(async (url) => {
			const updated = await this.service.update(id, { shopImage: url });
			return { url, merchant: updated };
		});
	}

	// merchant-details.controller.ts

@Get('categories-shops')
getCategoriesAndShopNames() {
  return this.service.getCategoriesAndShopNames();
}

}



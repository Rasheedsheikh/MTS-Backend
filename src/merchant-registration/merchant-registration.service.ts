import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantRegistration } from './entities/merchant-registration.entity';
import { CreateMerchantDto } from './dto/create-merchant-registration.dto';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';
import { CompleteMerchantDto } from './dto/complete-merchant.dto';
import { S3Service } from '../common/s3.service';
import { PaymentService } from './payment.service';
import { RazorpayService } from '../common/razorpay.service';
import { PartnerDetail } from 'src/partner-details/partner-detail.entity';

@Injectable()
export class MerchantRegistrationService {
  constructor(
    @InjectRepository(MerchantRegistration)
    private readonly repo: Repository<MerchantRegistration>,
    @InjectRepository(PartnerDetail)
    private readonly partnerRepo: Repository<PartnerDetail>,
    private readonly s3Service: S3Service,
    private readonly paymentService: PaymentService,
    private readonly razorpayService: RazorpayService,
  ) {}

  // Step 1: Create payment order (don't create merchant yet)
  async createPaymentOrder(dto: CreatePaymentOrderDto) {
    console.log('🔍 Creating payment order for merchant registration...');
    
    // Create Razorpay order for ₹1199
    const razorpayOrder = await this.razorpayService.createOrder(1199);

    return {
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
      },
      merchantData: dto, // Return the form data for later use
    };
  }

  // Step 2: Complete merchant registration after successful payment
  async completeRegistration(completeDto: CompleteMerchantDto, file?: Express.Multer.File) {
    console.log('🔍 Starting merchant registration completion...');
    console.log('🔍 Payment data:', {
      orderId: completeDto.orderId,
      paymentId: completeDto.paymentId,
      signature: completeDto.signature?.substring(0, 10) + '...',
      businessName: completeDto.businessName,
      mobileNumber: completeDto.mobileNumber
    });

    // Verify Razorpay signature first
    console.log('🔍 Verifying Razorpay signature...');
    const isSignatureValid = await this.razorpayService.verifySignature(
      completeDto.orderId,
      completeDto.paymentId,
      completeDto.signature,
    );

    console.log('Signature verification result:', isSignatureValid);

    if (!isSignatureValid) {
      console.log('❌ Invalid payment signature');
      throw new BadRequestException('Invalid payment signature');
    }

    console.log('✅ Payment signature verified successfully');

    let shopImage = completeDto.shopImageUrl;

    // Upload to S3 if file exists
    if (file) {
      const key = `merchants/${Date.now()}-${file.originalname}`;
      shopImage = await this.s3Service.uploadObject({
        key,
        body: file.buffer,
        contentType: file.mimetype,
      });
    }

    // Create merchant record with payment details
    const merchant = this.repo.create({
      businessName: completeDto.businessName,
      businessOwnerName: completeDto.businessOwnerName,
      mobileNumber: completeDto.mobileNumber,
      whatsappNumber: completeDto.whatsappNumber,
      category: completeDto.category,
      subcategory: completeDto.subcategory,
      address: completeDto.address,
      partnerCode: completeDto.partnerCode,
      shopImage,
      // Payment details
      razorpayOrderId: completeDto.orderId,
      razorpayPaymentId: completeDto.paymentId,
      razorpaySignature: completeDto.signature,
      amount: 1199.00,
      paymentStatus: 'completed',
      isPaymentCompleted: true,
    });

    console.log('🔍 Saving merchant to database...');
    const saved = await this.repo.save(merchant);
    console.log('✅ Merchant saved successfully with ID:', saved.id);

    // Handle partner commission (33%)
    if (completeDto.partnerCode) {
      try {
        const partner = await this.partnerRepo.findOne({ where: { partnerCode: completeDto.partnerCode } });
        if (partner) {
          console.log('🔍 Processing partner commission...');
          
          // Only transfer if partner has a razorpayAccountId configured
          if (partner.razorpayAccountId) {
            await this.paymentService.transferToPartner(0.33 * 1199 * 100, partner);
            console.log('✅ Partner commission transferred successfully');
          } else {
            console.log('⚠️ Partner commission skipped - no Razorpay account configured');
          }
        }
      } catch (error) {
        console.error('❌ Partner commission transfer failed:', error);
        // Don't fail the entire registration if commission transfer fails
        console.log('⚠️ Continuing registration despite commission transfer failure');
      }
    }

    return {
      message: 'Merchant registered and payment verified successfully',
      data: saved,
    };
  }

  async create(dto: CreateMerchantDto, file?: Express.Multer.File) {
    let shopImage = dto.shopImage;

    // ✅ Upload to AWS S3 if file exists
    if (file) {
      const key = `merchants/${Date.now()}-${file.originalname}`;
      shopImage = await this.s3Service.uploadObject({
        key,
        body: file.buffer,
        contentType: file.mimetype,
      });
    }

    // ✅ Create Razorpay payment (₹1199)
    const payment = await this.paymentService.createOrder(1199 * 100, 'INR', 'Merchant Registration');

    if (!payment) {
      throw new BadRequestException('Payment could not be initialized');
    }

    // ✅ Save Merchant record
    const merchant = this.repo.create({ ...dto, shopImage });
    const saved = await this.repo.save(merchant);

    // ✅ Handle partner commission (33%)
    // if (dto.partnerCode) {
    //   const partner = await this.partnerRepo.findOne({ where: { partnerCode: dto.partnerCode } });
    //   if (partner) {
    //     await this.paymentService.transferToPartner(0.33 * 2 * 100, partner);
    //   }
    // }

    return {
      message: 'Merchant registered successfully',
      data: saved,
      paymentDetails: payment,
    };
  }

  // Create merchant registration without payment
  async createWithoutPayment(dto: CreateMerchantDto, file?: Express.Multer.File) {
    console.log('🔍 Creating merchant registration without payment...');
    
    let shopImage = dto.shopImage;

    // Upload to S3 if file exists
    if (file) {
      const key = `merchants/${Date.now()}-${file.originalname}`;
      shopImage = await this.s3Service.uploadObject({
        key,
        body: file.buffer,
        contentType: file.mimetype,
      });
    }

    // Create merchant record without payment details
    const merchantData: Partial<MerchantRegistration> = {
      businessName: dto.businessName,
      businessOwnerName: dto.businessOwnerName,
      mobileNumber: dto.mobileNumber,
      whatsappNumber: dto.whatsappNumber,
      category: dto.category,
      subcategory: dto.subcategory,
      address: dto.address,
      shopImage,
      // Payment details set to default "no" values
      razorpayOrderId: 'none',
      razorpayPaymentId: 'none',
      razorpaySignature: 'none',
      amount: 0.00,
      paymentStatus: 'pending',
      isPaymentCompleted: false,
    };

    // Only set partnerCode if it's provided and not empty
    if (dto.partnerCode && dto.partnerCode.trim() !== '') {
      merchantData.partnerCode = dto.partnerCode;
    }

    const merchant = this.repo.create(merchantData);

    console.log('🔍 Saving merchant to database (without payment)...');
    const saved = await this.repo.save(merchant);
    console.log('✅ Merchant saved successfully with ID:', saved.id);

    return {
      message: 'Merchant registered successfully (without payment)',
      data: saved,
    };
  }

  async findAll() {
    return this.repo.find({ relations: ['partner'] });
  }

  async getPartnerCodes() {
    try {
      console.log('🔍 Fetching partner codes from partner_details table...');
      
      // Fetch all partners - TypeORM works better when fetching full entities
      const partners = await this.partnerRepo.find({
        order: { partnerCode: 'ASC' }
      });
      
      console.log('🔍 Found partners:', partners.length);
      
      // Extract partner codes and filter out null/empty values
      const codes = partners
        .map(p => p.partnerCode)
        .filter(code => code && code.trim() !== '')
        .sort(); // Sort alphabetically
      
      console.log('🔍 Valid partner codes:', codes);
      
      return codes;
    } catch (error) {
      console.error('❌ Error fetching partner codes:', error);
      console.error('❌ Error details:', error.message);
      throw new BadRequestException('Failed to fetch partner codes: ' + error.message);
    }
  }

  async findOne(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['partner'] });
  }

  async update(id: string, dto: Partial<CreateMerchantDto>) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new BadRequestException('Merchant not found');
    return { message: 'Merchant deleted successfully' };
  }
}

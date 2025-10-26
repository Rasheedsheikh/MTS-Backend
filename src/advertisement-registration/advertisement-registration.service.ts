import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdvertisementRegistration } from './entities/advertisement-registration.entity';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';
import { CompleteAdvertisementDto } from './dto/complete-advertisement.dto';
import { UpdateAdvertisementRegistrationDto } from './dto/update-advertisement-registration.dto';
import { S3Service } from '../common/s3.service';
import { RazorpayService } from '../common/razorpay.service';

@Injectable()
export class AdvertisementRegistrationService {
  constructor(
    @InjectRepository(AdvertisementRegistration)
    private readonly adRepository: Repository<AdvertisementRegistration>,
    private readonly s3Service: S3Service,
    private readonly razorpayService: RazorpayService,
  ) { }

  // Step 1: Create payment order (don't create advertisement yet)
  async createPaymentOrder(dto: CreatePaymentOrderDto) {
    // Create Razorpay order for ₹1
    const razorpayOrder = await this.razorpayService.createOrder(1);

    return {
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
      },
      advertisementData: dto, // Return the form data for later use
    };
  }

  // Step 2: Complete advertisement after successful payment
  async completeAdvertisement(completeDto: CompleteAdvertisementDto, file?: Express.Multer.File) {
    console.log('🔍 Starting advertisement completion...');
    console.log('🔍 Payment data:', {
      orderId: completeDto.orderId,
      paymentId: completeDto.paymentId,
      signature: completeDto.signature?.substring(0, 10) + '...',
      title: completeDto.title,
      mobileNumber: completeDto.mobileNumber
    });

    // Verify Razorpay signature first
    console.log('🔍 Verifying Razorpay signature...');
    const isSignatureValid = await this.razorpayService.verifySignature(
      completeDto.orderId,
      completeDto.paymentId,
      completeDto.signature,
    );

    console.log('🔍 Signature verification result:', isSignatureValid);

    if (!isSignatureValid) {
      console.log('❌ Invalid payment signature');
      throw new BadRequestException('Invalid payment signature');
    }

    console.log('✅ Payment signature verified successfully');

    let imageUrl = completeDto.imageUrl;

    // Upload to S3 if file exists
    if (file) {
      const key = `advertisements/${Date.now()}-${file.originalname}`;
      imageUrl = await this.s3Service.uploadObject({
        key,
        body: file.buffer,
        contentType: file.mimetype,
      });
    }

    // Now create the advertisement with payment details
    const ad = new AdvertisementRegistration();
    ad.title = completeDto.title;
    ad.description = completeDto.description || '';
    ad.location = completeDto.location;
    ad.mobileNumber = completeDto.mobileNumber;
    ad.imageUrl = imageUrl;
    ad.sliderType = completeDto.sliderType || '';
    ad.startDate = completeDto.startDate ? new Date(completeDto.startDate) : null;
    ad.endDate = completeDto.endDate ? new Date(completeDto.endDate) : null;
    ad.amount = 1.00;
    ad.razorpayOrderId = completeDto.orderId;
    ad.razorpayPaymentId = completeDto.paymentId;
    ad.razorpaySignature = completeDto.signature;
    ad.paymentStatus = 'completed';
    ad.isPaymentCompleted = true;
    ad.isActive = true;

    const savedAd = await this.adRepository.save(ad);

    return {
      message: 'Advertisement created and payment verified successfully',
      advertisement: savedAd,
    };
  }

  // Alternative method: Complete advertisement with form data (for frontend convenience)
  async completeAdvertisementWithFormData(
    formData: any,
    paymentData: CompleteAdvertisementDto,
    file?: Express.Multer.File
  ) {
    // Verify Razorpay signature first
    const isSignatureValid = await this.razorpayService.verifySignature(
      paymentData.orderId,
      paymentData.paymentId,
      paymentData.signature,
    );

    if (!isSignatureValid) {
      throw new BadRequestException('Invalid payment signature');
    }

    let imageUrl = paymentData.imageUrl;

    // Upload to S3 if file exists
    if (file) {
      const key = `advertisements/${Date.now()}-${file.originalname}`;
      imageUrl = await this.s3Service.uploadObject({
        key,
        body: file.buffer,
        contentType: file.mimetype,
      });
    }

    // Create the advertisement with payment details
    const ad = new AdvertisementRegistration();
    ad.title = formData.title;
    ad.description = formData.description || '';
    ad.location = formData.location;
    ad.mobileNumber = formData.mobileNumber;
    ad.imageUrl = imageUrl;
    ad.sliderType = formData.sliderType || '';
    ad.startDate = formData.startDate ? new Date(formData.startDate) : null;
    ad.endDate = formData.endDate ? new Date(formData.endDate) : null;
    ad.amount = 1.00;
    ad.razorpayOrderId = paymentData.orderId;
    ad.razorpayPaymentId = paymentData.paymentId;
    ad.razorpaySignature = paymentData.signature;
    ad.paymentStatus = 'completed';
    ad.isPaymentCompleted = true;
    ad.isActive = true;

    const savedAd = await this.adRepository.save(ad);

    return {
      message: 'Advertisement created and payment verified successfully',
      advertisement: savedAd,
    };
  }

  async findAll() {
    return this.adRepository.find({
      where: { isActive: true, isPaymentCompleted: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(advertisement_id: string) {
    const ad = await this.adRepository.findOne({ where: { advertisement_registartion_id: advertisement_id } });
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

    // Optional: Delete from S3
    // await this.s3Service.deleteObject(ad.imageUrl);

    await this.adRepository.remove(ad);
    return { message: `Advertisement ${advertisement_id} deleted successfully` };
  }
}

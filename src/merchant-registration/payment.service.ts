import { Injectable } from '@nestjs/common';

import Razorpay from 'razorpay';
@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(amount: number, currency: string, receipt: string) {
    return this.razorpay.orders.create({
      amount,
      currency,
      receipt,
      payment_capture: true,
    });
  }

  async transferToPartner(amount: number, partner: any) {
    return this.razorpay.transfers.create({
      amount,
      currency: 'INR',
      account: partner.razorpayAccountId, // must exist in partner table
      notes: {
        partner: partner.partnerCode,
      },
    });
  }
}

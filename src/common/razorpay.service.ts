// src/common/razorpay.service.ts

import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class RazorpayService {
    private razorpay: Razorpay;
    constructor() {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            throw new Error('Razorpay credentials are not defined in environment variables.');
        }

        this.razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
    }

    /**
     * Create a Razorpay order for ₹1 (or any given amount in rupees).
     */
    async createOrder(amountInRupees: number) {
        const amountInPaise = amountInRupees * 100;

        const options = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
            payment_capture: 1,
        };

        return await this.razorpay.orders.create(options);
    }

    /**
     * Verify Razorpay signature.
     */
    async verifySignature(
        orderId: string,
        paymentId: string,
        signature: string,
    ): Promise<boolean> {
        console.log('🔍 Verifying Razorpay signature...');
        console.log('🔍 Order ID:', orderId);
        console.log('🔍 Payment ID:', paymentId);
        console.log('🔍 Received signature:', signature?.substring(0, 10) + '...');

        const secret = process.env.RAZORPAY_KEY_SECRET;

        if (!secret) {
            console.log('❌ RAZORPAY_KEY_SECRET is not defined');
            throw new Error('RAZORPAY_KEY_SECRET is not defined.');
        }

        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');

        console.log('🔍 Generated signature:', generatedSignature?.substring(0, 10) + '...');
        console.log('🔍 Signatures match:', generatedSignature === signature);

        return generatedSignature === signature;
    }
}

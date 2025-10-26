# Advertisement Registration Payment Integration

## Overview
The advertisement registration module now includes payment functionality using Razorpay. Users must pay ₹1 to complete their advertisement registration.

## Payment Flow

### 1. Create Advertisement Registration (with Payment Order)
**Endpoint:** `POST /advertisement-registration`

**Request Body:**
```json
{
  "title": "My Advertisement",
  "description": "Advertisement description",
  "location": "Mumbai",
  "sliderType": "banner",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

**Response:**
```json
{
  "advertisement": {
    "advertisement_registartion_id": "uuid",
    "title": "My Advertisement",
    "description": "Advertisement description",
    "location": "Mumbai",
    "amount": 1.00,
    "razorpayOrderId": "order_xyz123",
    "paymentStatus": "pending",
    "isPaymentCompleted": false,
    "isActive": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "razorpayOrder": {
    "id": "order_xyz123",
    "amount": 100,
    "currency": "INR",
    "receipt": "receipt_order_1234567890"
  }
}
```

### 2. Verify Payment
**Endpoint:** `POST /advertisement-registration/:advertisement_registration_id/verify-payment`

**Request Body:**
```json
{
  "orderId": "order_xyz123",
  "paymentId": "pay_abc456",
  "signature": "signature_hash"
}
```

**Response (Success):**
```json
{
  "message": "Payment verified successfully",
  "advertisement": {
    "advertisement_registartion_id": "uuid",
    "title": "My Advertisement",
    "description": "Advertisement description",
    "location": "Mumbai",
    "amount": 1.00,
    "razorpayOrderId": "order_xyz123",
    "razorpayPaymentId": "pay_abc456",
    "razorpaySignature": "signature_hash",
    "paymentStatus": "completed",
    "isPaymentCompleted": true,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:05:00.000Z"
  }
}
```

## Database Changes

### New Fields Added to AdvertisementRegistration Entity:
- `razorpayOrderId`: Razorpay order ID
- `razorpayPaymentId`: Razorpay payment ID  
- `razorpaySignature`: Razorpay signature for verification
- `amount`: Payment amount (default: 1.00)
- `paymentStatus`: 'pending' | 'completed' | 'failed'
- `isPaymentCompleted`: Boolean flag for payment completion

## Frontend Integration

### Step 1: Create Advertisement
```javascript
const formData = new FormData();
formData.append('title', 'My Advertisement');
formData.append('description', 'Advertisement description');
formData.append('location', 'Mumbai');
formData.append('image', file); // optional

const response = await fetch('/advertisement-registration', {
  method: 'POST',
  body: formData
});

const { advertisement, razorpayOrder } = await response.json();
```

### Step 2: Initialize Razorpay Payment
```javascript
const options = {
  key: 'YOUR_RAZORPAY_KEY_ID',
  amount: razorpayOrder.amount,
  currency: razorpayOrder.currency,
  name: 'Your Company',
  description: 'Advertisement Registration',
  order_id: razorpayOrder.id,
  handler: async function (response) {
    // Step 3: Verify payment
    await verifyPayment(advertisement.advertisement_registartion_id, response);
  },
  prefill: {
    name: 'Customer Name',
    email: 'customer@example.com',
    contact: '9999999999'
  },
  theme: {
    color: '#3399cc'
  }
};

const rzp = new Razorpay(options);
rzp.open();
```

### Step 3: Verify Payment
```javascript
async function verifyPayment(advertisementId, paymentResponse) {
  const response = await fetch(`/advertisement-registration/${advertisementId}/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      orderId: paymentResponse.razorpay_order_id,
      paymentId: paymentResponse.razorpay_payment_id,
      signature: paymentResponse.razorpay_signature
    })
  });

  const result = await response.json();
  
  if (response.ok) {
    console.log('Payment verified successfully!');
    // Redirect to success page or show success message
  } else {
    console.error('Payment verification failed:', result.message);
    // Show error message
  }
}
```

## Environment Variables Required

Make sure these environment variables are set:
```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Important Notes

1. **Payment Amount**: Fixed at ₹1 (100 paise)
2. **Advertisement Status**: Only paid advertisements (`isPaymentCompleted: true`) are shown in the public listing
3. **Payment Verification**: Always verify payment on the backend using Razorpay signature
4. **Error Handling**: Handle payment failures gracefully
5. **Security**: Never trust frontend payment data; always verify on backend

## Testing

### Test Mode
Use Razorpay test credentials for development:
- Test cards: https://razorpay.com/docs/payments/test-cards/
- Test UPI: Use any UPI ID ending with `@razorpay`

### Production
Replace test credentials with live credentials for production deployment.

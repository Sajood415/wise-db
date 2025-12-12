import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
    userId: mongoose.Types.ObjectId;
    packageName: string;
    packageType: 'monthly' | 'yearly' | 'pay_as_you_go';
    amount: number;
    currency: string;
    stripeSessionId: string;
    stripePaymentIntentId?: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    searchesIncluded: number;
    trialExtensionDays: number;
    creditsPurchased?: number; // For pay-as-you-go: number of credits/searches purchased
    metadata?: {
        description?: string;
        features?: string[];
    };
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    packageName: {
        type: String,
        required: true,
        enum: ['Basic Monthly', 'Basic Yearly', 'Premium Monthly', 'Premium Yearly', 'Pay As You Go']
    },
    packageType: {
        type: String,
        required: true,
        enum: ['monthly', 'yearly', 'pay_as_you_go']
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: 'USD'
    },
    stripeSessionId: {
        type: String,
        required: true,
        unique: true
    },
    stripePaymentIntentId: {
        type: String
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    searchesIncluded: {
        type: Number,
        required: true
    },
    creditsPurchased: {
        type: Number,
        required: false
    },
    trialExtensionDays: {
        type: Number,
        required: true,
        default: 30
    },
    metadata: {
        description: String,
        features: [String]
    }
}, {
    timestamps: true
});

// Index for efficient queries
PaymentSchema.index({ userId: 1, status: 1 });
PaymentSchema.index({ createdAt: -1 });

// In development, delete cached model to ensure schema updates are applied
if (process.env.NODE_ENV === 'development' && mongoose.models.Payment) {
    delete mongoose.models.Payment;
}

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

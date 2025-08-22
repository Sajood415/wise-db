import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
    userId: mongoose.Types.ObjectId;
    packageName: string;
    packageType: 'monthly' | 'yearly';
    amount: number;
    currency: string;
    stripeSessionId: string;
    stripePaymentIntentId?: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    searchesIncluded: number;
    trialExtensionDays: number;
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
        enum: ['Basic Monthly', 'Basic Yearly', 'Premium Monthly', 'Premium Yearly']
    },
    packageType: {
        type: String,
        required: true,
        enum: ['monthly', 'yearly']
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
PaymentSchema.index({ stripeSessionId: 1 });
PaymentSchema.index({ createdAt: -1 });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

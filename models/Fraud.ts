import mongoose, { Document, Schema } from 'mongoose';

export interface IFraud extends Document {
    // Basic fraud information
    title: string;
    description: string;
    type: 'email' | 'phone' | 'website' | 'identity' | 'financial' | 'other';

    // Fraudster details (who committed the fraud)
    fraudsterDetails: {
        suspiciousEmail?: string;
        suspiciousPhone?: string;
        suspiciousWebsite?: string;
        suspiciousName?: string;
        suspiciousCompany?: string;
        amount?: number;
        currency?: string;
        date?: Date;
    };

    // Status management
    status: 'pending' | 'approved' | 'rejected' | 'under_review';
    reviewedBy?: mongoose.Types.ObjectId; // sub_admin or super_admin who reviewed
    reviewNotes?: string;

    // Submission info
    submittedBy?: mongoose.Types.ObjectId; // null if guest submission
    guestSubmission?: {
        name: string;
        email: string;
        phone?: string;
    };

    // Verification and evidence
    evidence?: {
        screenshots: string[]; // URLs to uploaded images
        documents: string[]; // URLs to uploaded documents
        additionalInfo: string;
    };

    // Geographic info
    location?: string;

    // For search and categorization
    tags: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';

    // Timestamps
    reportedAt: Date;
    reviewedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const FraudSchema = new Schema<IFraud>({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    type: {
        type: String,
        enum: ['email', 'phone', 'website', 'identity', 'financial', 'other'],
        required: true
    },

    fraudsterDetails: {
        suspiciousEmail: {
            type: String,
            lowercase: true,
            trim: true
        },
        suspiciousPhone: {
            type: String,
            trim: true
        },
        suspiciousWebsite: {
            type: String,
            lowercase: true,
            trim: true
        },
        suspiciousName: {
            type: String,
            trim: true
        },
        suspiciousCompany: {
            type: String,
            trim: true
        },
        amount: {
            type: Number,
            min: 0
        },
        currency: {
            type: String,
            default: 'USD',
            uppercase: true
        },
        date: Date
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'under_review'],
        default: 'pending'
    },
    reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewNotes: {
        type: String,
        maxlength: 1000
    },

    submittedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    guestSubmission: {
        name: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        }
    },

    evidence: {
        screenshots: [{
            type: String
        }],
        documents: [{
            type: String
        }],
        additionalInfo: {
            type: String,
            maxlength: 1000
        }
    },

    location: {
        type: String,
        trim: true
    },

    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],

    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },

    reportedAt: {
        type: Date,
        default: Date.now
    },
    reviewedAt: Date
}, {
    timestamps: true
});

// Indexes for search performance
FraudSchema.index({ status: 1, createdAt: -1 });
FraudSchema.index({ type: 1, severity: 1 });
FraudSchema.index({ 'fraudsterDetails.suspiciousEmail': 1 });
FraudSchema.index({ 'fraudsterDetails.suspiciousPhone': 1 });
FraudSchema.index({ 'fraudsterDetails.suspiciousWebsite': 1 });
FraudSchema.index({ tags: 1 });

export default mongoose.models.Fraud || mongoose.model<IFraud>('Fraud', FraudSchema);
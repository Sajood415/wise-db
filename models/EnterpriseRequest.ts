import mongoose, { Document, Schema } from 'mongoose';

export interface IEnterpriseRequest extends Document {
    companyName: string;
    contactName: string;
    businessEmail: string;
    phoneNumber: string;
    industry: string;
    implementationTimeline?: string;
    numberOfSearches: number;
    numberOfUsers: number;
    whenNeeded: string;
    message?: string;
    status: 'new' | 'in_review' | 'contacted' | 'closed';
    // Sales & payment workflow
    pricingAmount?: number; // total amount agreed (in smallest currency unit cents if Stripe, else number)
    pricingCurrency?: string; // e.g. USD
    allowanceSearches?: number; // total searches included for enterprise
    allowanceUsers?: number; // how many users enterprise admin can add
    stripeCheckoutUrl?: string; // if using Stripe pay-by-link/session url
    paymentReceived?: boolean; // true if payment confirmed (manual or via Stripe verify)
    paymentMethod?: 'stripe' | 'bank_transfer' | 'cash' | 'cheque' | 'other';
    paymentTxnId?: string; // bank txn id / reference
    paymentTxnDate?: Date;
    paymentNotes?: string;
    signupToken?: string; // token to generate enterprise admin signup link
    signupTokenExpiresAt?: Date;
    enterpriseAdminEmail?: string; // email to be used by enterprise admin signup
    createdAt: Date;
    updatedAt: Date;
}

const EnterpriseRequestSchema = new Schema<IEnterpriseRequest>({
    companyName: { type: String, required: true, trim: true, maxlength: 200 },
    contactName: { type: String, required: true, trim: true, maxlength: 120 },
    businessEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.[A-Za-z]{2,})+$/, 'Please enter a valid email']
    },
    phoneNumber: { type: String, required: true, trim: true, maxlength: 30 },
    industry: { type: String, required: true, trim: true, maxlength: 100 },
    implementationTimeline: { type: String, required: false, trim: true, maxlength: 100 },
    numberOfSearches: { type: Number, required: true, min: 0 },
    numberOfUsers: { type: Number, required: true, min: 1 },
    whenNeeded: { type: String, required: true, trim: true, maxlength: 100 },
    message: { type: String, trim: true, maxlength: 2000 },
    status: { type: String, enum: ['new', 'in_review', 'contacted', 'closed'], default: 'new' },
    // Sales & payment workflow fields (optional, set by admin)
    pricingAmount: { type: Number, required: false, min: 0 },
    pricingCurrency: { type: String, required: false, trim: true, uppercase: true, maxlength: 10 },
    allowanceSearches: { type: Number, required: false, min: 0 },
    allowanceUsers: { type: Number, required: false, min: 0 },
    stripeCheckoutUrl: { type: String, required: false, trim: true, maxlength: 2048 },
    paymentReceived: { type: Boolean, default: false },
    paymentMethod: { type: String, required: false, enum: ['stripe', 'bank_transfer', 'cash', 'cheque', 'other'] },
    paymentTxnId: { type: String, required: false, trim: true, maxlength: 200 },
    paymentTxnDate: { type: Date },
    paymentNotes: { type: String, required: false, trim: true, maxlength: 1000 },
    signupToken: { type: String, required: false, trim: true, index: true, unique: false },
    signupTokenExpiresAt: { type: Date },
    enterpriseAdminEmail: { type: String, required: false, lowercase: true, trim: true, match: [/^$|^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.[A-Za-z]{2,})+$/, 'Please enter a valid email'] },
}, { timestamps: true });

export default mongoose.models.EnterpriseRequest || mongoose.model<IEnterpriseRequest>('EnterpriseRequest', EnterpriseRequestSchema);



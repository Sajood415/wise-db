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
}, { timestamps: true });

export default mongoose.models.EnterpriseRequest || mongoose.model<IEnterpriseRequest>('EnterpriseRequest', EnterpriseRequestSchema);



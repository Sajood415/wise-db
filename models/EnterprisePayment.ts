import mongoose, { Document, Schema } from 'mongoose'

export interface IEnterprisePayment extends Document {
    enterpriseRequestId: mongoose.Types.ObjectId
    stripeSessionId?: string
    stripePaymentIntentId?: string
    method?: 'stripe' | 'bank_transfer' | 'cash' | 'cheque' | 'other'
    amount: number
    currency: string
    status: 'pending' | 'completed' | 'failed' | 'cancelled'
    allowanceSearches?: number
    allowanceUsers?: number
    enterpriseAdminEmail?: string
    metadata?: Record<string, any>
    paidAt?: Date
    createdAt: Date
    updatedAt: Date
}

const EnterprisePaymentSchema = new Schema<IEnterprisePayment>({
    enterpriseRequestId: { type: Schema.Types.ObjectId, ref: 'EnterpriseRequest', required: true, index: true },
    stripeSessionId: { type: String, index: true },
    stripePaymentIntentId: { type: String },
    method: { type: String, enum: ['stripe', 'bank_transfer', 'cash', 'cheque', 'other'] },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USD', uppercase: true, trim: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'cancelled'], default: 'pending', index: true },
    allowanceSearches: { type: Number },
    allowanceUsers: { type: Number },
    enterpriseAdminEmail: { type: String, lowercase: true, trim: true },
    metadata: { type: Schema.Types.Mixed },
    paidAt: { type: Date },
}, { timestamps: true })

EnterprisePaymentSchema.index({ enterpriseRequestId: 1, createdAt: -1 })

export default mongoose.models.EnterprisePayment || mongoose.model<IEnterprisePayment>('EnterprisePayment', EnterprisePaymentSchema)



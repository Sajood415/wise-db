import mongoose, { Schema, Document } from 'mongoose'

export interface ISearchLog extends Document {
    user: mongoose.Types.ObjectId
    q?: string
    type?: string
    status?: string
    country?: string
    minAmount?: number
    maxAmount?: number
    fuzziness?: number
    source: 'real' | 'dummy'
    createdAt: Date
    updatedAt: Date
}

const SearchLogSchema = new Schema<ISearchLog>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    q: { type: String, trim: true },
    type: { type: String, trim: true },
    status: { type: String, trim: true },
    country: { type: String, trim: true },
    minAmount: { type: Number },
    maxAmount: { type: Number },
    fuzziness: { type: Number, min: 0, max: 100 },
    source: { type: String, enum: ['real', 'dummy'], required: true },
}, { timestamps: true })

SearchLogSchema.index({ user: 1, createdAt: -1 })

export default mongoose.models.SearchLog || mongoose.model<ISearchLog>('SearchLog', SearchLogSchema)



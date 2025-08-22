import mongoose, { Schema, Document } from 'mongoose'

export interface IHelpRequest extends Document {
    name: string
    email: string
    subject: string
    issueType: string
    message: string
    status: 'pending' | 'in_progress' | 'resolved' | 'closed'
    createdAt: Date
    updatedAt: Date
}

const HelpRequestSchema = new Schema<IHelpRequest>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        maxlength: [100, 'Email cannot exceed 100 characters']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true,
        maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    issueType: {
        type: String,
        required: [true, 'Issue type is required'],
        enum: {
            values: [
                'General Question',
                'Technical Issue',
                'Fraud Reporting Help',
                'Account Issues',
                'Billing & Payments',
                'Feature Request',
                'Bug Report',
                'Other'
            ],
            message: 'Please select a valid issue type'
        }
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        minlength: [20, 'Message must be at least 20 characters long'],
        maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'resolved', 'closed'],
        default: 'pending'
    }
}, {
    timestamps: true
})

// Create indexes for better query performance
HelpRequestSchema.index({ email: 1, createdAt: -1 })
HelpRequestSchema.index({ status: 1, createdAt: -1 })
HelpRequestSchema.index({ issueType: 1 })

export default mongoose.models.HelpRequest || mongoose.model<IHelpRequest>('HelpRequest', HelpRequestSchema)

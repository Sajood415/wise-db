import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'individual' | 'sub_admin' | 'super_admin' | 'enterprise_admin' | 'enterprise_user';
    subscription: {
        type: 'free_trial' | 'paid_package' | 'enterprise_package';
        status: 'active' | 'expired' | 'cancelled';
        trialEndsAt?: Date;
        packageEndsAt?: Date;
        searchesUsed: number;
        searchLimit: number;
        canAccessRealData: boolean; // false for free trial (dummy data), true for paid
    };
    packageName?: string; // Track which package user purchased
    company?: {
        name: string;
        enterpriseId?: mongoose.Types.ObjectId;
    };
    createdBy?: mongoose.Types.ObjectId; // For enterprise users (created by enterprise admin)
    permissions: {
        canSearch: boolean;
        canReviewFraud: boolean; // For sub_admin to review/accept/reject
        canEditPendingFraud: boolean; // For sub_admin to edit pending fraud data
        canManageUsers: boolean; // For enterprise_admin to add users
        canManageEnterprise: boolean; // For super_admin
        canViewAnalytics: boolean;
    };
    lastLogin?: Date;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;

    // Methods
    isTrialExpired(): boolean;
    canPerformSearch(): boolean;
}

const UserSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['individual', 'sub_admin', 'super_admin', 'enterprise_admin', 'enterprise_user'],
        default: 'individual'
    },
    subscription: {
        type: {
            type: String,
            enum: ['free_trial', 'paid_package', 'enterprise_package'],
            default: 'free_trial'
        },
        status: {
            type: String,
            enum: ['active', 'expired', 'cancelled'],
            default: 'active'
        },
        trialEndsAt: {
            type: Date,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        },
        packageEndsAt: Date,
        searchesUsed: {
            type: Number,
            default: 0
        },
        searchLimit: {
            type: Number,
            default: 10 // 10 searches for free trial with dummy data
        },
        canAccessRealData: {
            type: Boolean,
            default: false // false = dummy data, true = real fraud data
        }
    },
    company: {
        name: String,
        enterpriseId: {
            type: Schema.Types.ObjectId,
            ref: 'Enterprise'
        }
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    permissions: {
        canSearch: {
            type: Boolean,
            default: true
        },
        canReviewFraud: {
            type: Boolean,
            default: false
        },
        canEditPendingFraud: {
            type: Boolean,
            default: false
        },
        canManageUsers: {
            type: Boolean,
            default: false
        },
        canManageEnterprise: {
            type: Boolean,
            default: false
        },
        canViewAnalytics: {
            type: Boolean,
            default: false
        }
    },
    lastLogin: Date,
    isActive: {
        type: Boolean,
        default: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    packageName: {
        type: String
    }
}, {
    timestamps: true
});

// Middleware to set permissions based on role
UserSchema.pre<IUser>('save', function (next: any) {
    if (this.isModified('role')) {
        switch (this.role) {
            case 'individual':
                this.permissions = {
                    canSearch: this.subscription.status === 'active',
                    canReviewFraud: false,
                    canEditPendingFraud: false,
                    canManageUsers: false,
                    canManageEnterprise: false,
                    canViewAnalytics: false
                };
                // Free trial: 10 searches with dummy data only
                this.subscription.searchLimit = 10;
                this.subscription.canAccessRealData = false;
                break;

            case 'sub_admin':
                this.permissions = {
                    canSearch: true,
                    canReviewFraud: true, // Can review/accept/reject fraud reports
                    canEditPendingFraud: true, // Can edit pending fraud data
                    canManageUsers: false,
                    canManageEnterprise: false,
                    canViewAnalytics: true
                };
                this.subscription.searchLimit = -1; // Unlimited
                this.subscription.canAccessRealData = true;
                break;

            case 'super_admin':
                this.permissions = {
                    canSearch: true,
                    canReviewFraud: true,
                    canEditPendingFraud: true,
                    canManageUsers: true,
                    canManageEnterprise: true, // Can manage everything
                    canViewAnalytics: true
                };
                this.subscription.searchLimit = -1; // Unlimited
                this.subscription.canAccessRealData = true;
                break;

            case 'enterprise_admin':
                this.permissions = {
                    canSearch: true,
                    canReviewFraud: false,
                    canEditPendingFraud: false,
                    canManageUsers: true, // Can add enterprise users
                    canManageEnterprise: false,
                    canViewAnalytics: true
                };
                // Search limit based on package bought through sales
                this.subscription.canAccessRealData = true;
                break;

            case 'enterprise_user':
                this.permissions = {
                    canSearch: true,
                    canReviewFraud: false,
                    canEditPendingFraud: false,
                    canManageUsers: false,
                    canManageEnterprise: false,
                    canViewAnalytics: false
                };
                // Search limit inherited from enterprise admin's package
                this.subscription.canAccessRealData = true;
                break;
        }
    }
    next();
});

// Check if trial has expired
UserSchema.methods.isTrialExpired = function (this: IUser) {
    if (this.subscription.type === 'free_trial' && this.subscription.trialEndsAt) {
        return new Date() > this.subscription.trialEndsAt;
    }
    return false;
};

// Check if user can search
UserSchema.methods.canPerformSearch = function (this: IUser) {
    if (this.subscription.searchLimit === -1) return true; // Unlimited
    if (this.isTrialExpired() && this.subscription.type === 'free_trial') return false;
    return this.subscription.searchesUsed < this.subscription.searchLimit;
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
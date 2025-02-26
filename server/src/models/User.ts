import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  walletAddress?: string;
  googleId?: string;
  email?: string;
  bio?: string;
  isProfileComplete: boolean;
  authMethod: 'wallet' | 'google';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_-]+$/
  },
  walletAddress: {
    type: String,
    unique: true,
    sparse: true, // Allow null values to not conflict with uniqueness
    trim: true,
    lowercase: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  bio: {
    type: String,
    maxlength: 500
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  authMethod: {
    type: String,
    enum: ['wallet', 'google'],
    required: true
  }
}, {
  timestamps: true
});

// Create indexes
userSchema.index({ username: 1 });
userSchema.index({ walletAddress: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ email: 1 });

export const User = model<IUser>('User', userSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IVaultItem extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  username: string;
  encryptedPassword: string;
  url?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VaultItemSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  username: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  encryptedPassword: {
    type: String,
    required: true
  },
  url: {
    type: String,
    trim: true,
    maxlength: 500
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Index for faster queries
VaultItemSchema.index({ userId: 1, title: 1 });

export default mongoose.model<IVaultItem>('VaultItem', VaultItemSchema);
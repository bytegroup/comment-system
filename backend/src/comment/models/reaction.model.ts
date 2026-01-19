import mongoose, {Schema, Document, Types} from 'mongoose';


export interface IReaction extends Document {
  _id: Types.ObjectId;
  user: mongoose.Types.ObjectId;
  comment: mongoose.Types.ObjectId;
  type: 'like' | 'dislike';
  createdAt: Date;
}

const reactionSchema = new Schema<IReaction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: [true, 'User is required'],
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      required: [true, 'Comment is required'],
      index: true,
    },
    type: {
      type: String,
      enum: ['like', 'dislike'],
      required: [true, 'Reaction type is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one reaction per user per comment
reactionSchema.index({ user: 1, comment: 1 }, { unique: true });

export const Reaction = mongoose.model<IReaction>('Reaction', reactionSchema);
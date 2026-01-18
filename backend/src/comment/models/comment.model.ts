import mongoose, {Schema, Document, Types} from 'mongoose';

export interface IComment extends Document {
  _id: Types.ObjectId;
  content: string;
  author: mongoose.Types.ObjectId;
  parentComment?: mongoose.Types.ObjectId;
  likesCount: number;
  dislikesCount: number;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      minlength: [1, 'Comment must be at least 1 character'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
      index: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
      index: true,
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    dislikesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
commentSchema.index({ createdAt: -1 }); // For sorting by newest
commentSchema.index({ likesCount: -1 }); // For sorting by most liked
commentSchema.index({ dislikesCount: -1 }); // For sorting by most disliked
commentSchema.index({ author: 1, createdAt: -1 }); // For user's comments

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
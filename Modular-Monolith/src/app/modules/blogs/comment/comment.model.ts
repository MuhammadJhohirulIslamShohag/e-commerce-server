import { Schema, model } from 'mongoose';
import { CommentModel, IComment } from './comment.interface';

// Comment schema
const commentSchema = new Schema<IComment, CommentModel>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      validate: {
        validator: function (v: string) {
          return /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`,
      },
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// Comment model
export const Comment = model<IComment, CommentModel>(
  'BlogComment',
  commentSchema,
);

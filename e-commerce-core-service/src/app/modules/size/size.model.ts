import { Schema, model } from 'mongoose';
import { SizeModel, ISize } from './size.interface';

// size schema
const sizeSchema = new Schema<ISize, SizeModel>(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Please provide a Size name!'],
      minLength: [1, 'Name must be at least 1 characters'],
      maxLength: [40, 'Name is to large!'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// size model
const Size = model<ISize, SizeModel>('Size', sizeSchema);

export default Size;

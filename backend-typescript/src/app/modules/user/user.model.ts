/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import isEmail from 'validator/lib/isEmail';
import { userRoleFields } from '../../../constants/user';
import config from '../../../config';

const userSchema = new Schema<IUser, UserModel>(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Please Enter Your User Name'],
      maxLength: [45, 'User Name should not greater than 45 characters'],
      minLength: [5, 'User Name should not less than 5 characters'],
    },
    fullName: {
      type: String,
      maxLength: [65, 'Full Name should not greater than 65 characters'],
      minLength: [5, 'Full Name should not less than 5 characters'],
    },
    email: {
      type: String,
      index: true,
      required: true,
      unique: true,
      validate: [isEmail, 'Please Enter Valid Email'],
    },
    image: {
      url: {
        type: String,
        default: 'https://via.placeholder.com/200x200.png?text=Profile',
      },
      public_id: {
        type: String,
        default: `${Date.now()}`,
      },
    },
    role: {
      type: String,
      enum: userRoleFields,
      default: 'user',
    },
    cart: {
      type: Array,
      default: [],
    },
    address: {
      fullName: {
        type: String,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      postalCode: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    about: {
      type: String,
    },
    wishList: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        isWishList: Boolean,
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.createUserAt = ret.createdAt;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (next) {
  const user = this;
  // hash the password before save data to collection
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

userSchema.statics.isUserExit = async function (
  phoneNumber: string
): Promise<Pick<IUser, '_id' | 'password' | 'role' | 'email'> | null> {
  return await User.findOne(
    { phoneNumber: phoneNumber },
    { password: 1, role: 1 }
  );
};

userSchema.statics.isPasswordMatched = async function (
  savedPassword: string,
  givenPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

const User = model<IUser, UserModel>('User', userSchema);

export default User;

import validator from 'validator';
import { Schema, model } from 'mongoose';
import { IAdmin, AdminModel } from './admin.interface';
import { adminRoles, adminStatus } from './admin.constant';

// admin schema
const adminSchema = new Schema<IAdmin, AdminModel>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide a name!'],
      minLength: [3, 'Name must be at least 3 characters1'],
      maxLength: [120, 'Name is to large!'],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Provide a valid email!'],
      required: [true, 'Please provide a email!'],
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
      validate: {
        validator: (value: string) =>
          validator.isStrongPassword(value, {
            minLength: 6,
            minLowercase: 3,
            minNumbers: 1,
            minUppercase: 1,
            minSymbols: 1,
          }),
        message: 'Password {value} is not strong!',
      },
      select: 0,
    },
    phone: {
      type: String,
      validate: {
        validator: function (v: string) {
          return /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`,
      },
      unique: true,
    },
    profileImage: {
      type: String,
      validate: [validator.isURL, 'Please provide valid profile image url!'],
    },
    address: {
      country: {
        type: String,
      },
      town: {
        type: String,
      },
      city: {
        type: String,
      },
      hometown: {
        type: String,
      },
    },
    about: {
      type: String,
    },
    designation: {
      type: String,
    },
    workAs: {
      type: String,
    },
    education: {
      type: String,
    },
    language: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
    },
    role: {
      type: String,
      enum: adminRoles,
      default: 'admin',
    },
    status: {
      type: String,
      enum: adminStatus,
      default: 'inActive',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// admin model
const Admin = model<IAdmin, AdminModel>('Admin', adminSchema);

export default Admin;

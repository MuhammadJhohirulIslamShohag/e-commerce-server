import bcrypt from 'bcrypt';
import validator from 'validator';
import { Schema, model } from 'mongoose';
import { IAdmin, AdminModel } from './admin.interface';
import { adminRoles, adminStatus } from './admin.constant';
import config from '../../../config';

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

// mongoose save hook for making hash password
adminSchema.pre('save', async function (next) {
  // If password isn't modified, no need to hash again
  if (!this.isModified('password')) {
    return next();
  }

  if (this.password) {
    const hashedPassword = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds)
    );
    this.password = hashedPassword;
  }

  next();
});

// static methods for checking is admin exit
adminSchema.statics.isExitAdmin = async function ({
  id = null,
  email = null,
}: {
  id?: string | null;
  email?: string | null;
}): Promise<IAdmin | null> {
  let result = null;

  if (id && email) {
    result = await Admin.findOne(
      {
        $or: [{ _id: id }, { email: email }],
      },
      { id: 1, password: 1, role: 1, email: 1, status: 1 }
    ).exec();
  }
  if (id) {
    result = await Admin.findOne(
      {
        _id: id,
      },
      { _id: 1, password: 1, role: 1, email: 1, status: 1 }
    ).exec();
  }
  if (email) {
    result = await Admin.findOne(
      {
        email: email,
      },
      { _id: 1, password: 1, role: 1, email: 1, status: 1 }
    ).exec();
  }

  return result;
};

// static method for is password is match
adminSchema.statics.isPasswordMatch = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return bcrypt.compare(givenPassword, savedPassword);
};

// admin model
const Admin = model<IAdmin, AdminModel>('Admin', adminSchema);

export default Admin;

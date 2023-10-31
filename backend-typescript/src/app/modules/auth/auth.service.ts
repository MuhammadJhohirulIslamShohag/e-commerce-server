/* eslint-disable @typescript-eslint/no-non-null-assertion */
import shortid from 'shortid';
import { IUser } from '../user/user.interface';
import User from '../user/user.model';

const createOrUpdateUser = async (payload: IUser): Promise<IUser | null> => {
  let user;
  if (payload.address) {
    const addressObject = {
      ...payload.address,
    };
    user = await User.findOneAndUpdate(
      { email: payload.email },
      { address: addressObject, username: payload.username },
      { new: true }
    );
  } else {
    if (payload.image) {
      const imageObject = {
        ...payload.image,
      };
      user = await User.findOneAndUpdate(
        { email: payload.email },
        { image: imageObject },
        { new: true }
      );
    } else {
      user = await User.findOneAndUpdate(
        { email: payload.email },
        { ...payload },
        { new: true }
      );
    }
  }
  if (user) {
    return user;
  } else {
    const newUser = await new User({
      ...payload,
      username: shortid.generate(),
    }).save();
    user = newUser;
  }
  return user;
};

const currentUser = async (email: string) => {
  const user = await User.findOne({ email }).exec();
  return user;
};

export const AuthService = {
  createOrUpdateUser,
  currentUser,
};

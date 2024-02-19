import httpStatus from 'http-status';

import QueryBuilder from '../../builder/query.builder';
import ApiError from '../../errors/ApiError';
import Banner from './banner.model';

import { IBanner, ICreateBanner } from './banner.interface';
import { ImageUploadHelpers } from '../../helpers/image-upload.helper';

class BannerServiceClass {
  #BannerModel;
  #QueryBuilder: typeof QueryBuilder;
  constructor() {
    this.#BannerModel = Banner;
    this.#QueryBuilder = QueryBuilder;
  }

  // create banner service
  readonly createBanner = async (payload: ICreateBanner) => {
    // upload image to aws s3 bucket
    const imageURL = await ImageUploadHelpers.imageUploadToS3Bucket(
      'BAN',
      'banner',
      payload.imageURL.buffer
    );

    // check already banner exit, if not, throw error
    const isExitBanner = await this.#BannerModel.findOne({
      imageURL: imageURL,
    });

    if (isExitBanner) {
      throw new ApiError(httpStatus.CONFLICT, `Banner Image Is Already Exit!`);
    }

    // create new banner
    const result = await this.#BannerModel.create({
      offer: payload.offer,
      imageURL: imageURL,
    });

    // if not created banner, throw error
    if (!result) {
      throw new ApiError(httpStatus.CONFLICT, `Banner Image Create Failed!`);
    }

    return result;
  };

  // get all banners service
  readonly allBanners = async (query: Record<string, unknown>) => {
    const userQuery = new this.#QueryBuilder(this.#BannerModel.find(), query)
      .filter()
      .sort()
      .paginate()
      .fields();

    // result of user
    const result = await userQuery.modelQuery;

    // get meta user
    const meta = await userQuery.countTotal();

    return {
      meta,
      result,
    };
  };

  // get single banner service
  readonly getSingleBanner = async (payload: string) => {
    const result = await this.#BannerModel
      .findById(payload)
      .populate('offer')
      .exec();
    return result;
  };

  // update banner service
  readonly updateBanner = async (id: string, payload: Partial<IBanner>) => {
    // check already banner exit, if not throw error
    const isExitBanner = await this.#BannerModel.findById({ _id: id });
    if (!isExitBanner) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Banner Image Not Found!');
    }

    const updatedBannerData: Partial<IBanner> = { ...payload };

    // update the banner
    const result = await this.#BannerModel.findOneAndUpdate(
      { _id: id },
      updatedBannerData,
      {
        new: true,
      }
    );

    return result;
  };

  // delete banner service
  readonly deleteBanner = async (payload: string) => {
    // check already banner exit, if not throw error
    const isExitBanner = await this.#BannerModel.findById({ _id: payload });
    if (!isExitBanner) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Banner Image Not Found!');
    }

    // delete the banner
    const result = await this.#BannerModel.findByIdAndDelete(payload);
    return result;
  };
}

export const BannerService = new BannerServiceClass();

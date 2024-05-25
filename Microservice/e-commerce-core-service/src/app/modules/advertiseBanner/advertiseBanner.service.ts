import httpStatus from 'http-status';

import ApiError from '../../errors/ApiError';
import QueryBuilder from '../../builder/query.builder';
import AdvertiseBanner from './advertiseBanner.model';

import {
  IAdvertiseBanner,
  ICreateAdvertiseBanner,
} from './advertiseBanner.interface';
import { ImageUploadHelpers } from '../../helpers/image-upload.helper';
import { IFile } from '../../interfaces';

class AdvertiseBannerServiceClass {
  #AdvertiseBannerModel;
  #QueryBuilder: typeof QueryBuilder;
  constructor() {
    this.#AdvertiseBannerModel = AdvertiseBanner;
    this.#QueryBuilder = QueryBuilder;
  }

  // create advertise banner service
  readonly createAdvertiseBanner = async (payload: ICreateAdvertiseBanner) => {
    const { name, imageURL, ...other } = payload;

    // check already advertise banner exit, if not, throw error
    const isExitAdvertiseBanner = await this.#AdvertiseBannerModel.findOne({
      name: name,
    });

    // check already advertise banner exit, throw error
    if (isExitAdvertiseBanner) {
      throw new ApiError(httpStatus.CONFLICT, 'Advertise Banner already Exit!');
    }

    let result = null;

    // checking date and compare
    if (payload.startDate && payload.endDate) {
      if (new Date(payload.startDate) >= new Date(payload.endDate)) {
        throw new ApiError(
          httpStatus.CONFLICT,
          'Advertise Banner Date should be greater than start date!'
        );
      }

      // upload image to aws s3 bucket
      const advertiseBannerImageURL =
        await ImageUploadHelpers.imageUploadToS3Bucket(
          'ABN',
          'advertiseBanner',
          imageURL.buffer
        );

      result = await this.#AdvertiseBannerModel.create({
        imageURL: advertiseBannerImageURL,
        name,
        ...other,
      });
    }
    // if not created Advertise Banner, throw error
    if (!result) {
      throw new ApiError(
        httpStatus.CONFLICT,
        `Advertise Banner Create Failed!`
      );
    }

    return result;
  };

  // get all advertise banners service
  readonly allAdvertiseBanners = async (query: Record<string, unknown>) => {
    const advertiseBannerQuery = new this.#QueryBuilder(
      this.#AdvertiseBannerModel.find(),
      query
    )
      .filter()
      .sort()
      .paginate()
      .fields();

    // result of advertise banner
    const result = await advertiseBannerQuery.modelQuery;

    // get meta advertise banner
    const meta = await advertiseBannerQuery.countTotal();

    return {
      meta,
      result,
    };
  };

  // get single advertise banner service
  readonly getSingleAdvertiseBanner = async (payload: string) => {
    const result = await this.#AdvertiseBannerModel.findById(payload).exec();
    return result;
  };

  // update advertise banner service
  readonly updateAdvertiseBanner = async (
    id: string,
    payload: Partial<IAdvertiseBanner>,
    advertiseBannerImageFile: IFile | null
  ) => {
    // check already advertise banner exit, if not throw error
    const isExitAdvertiseBanner = await this.#AdvertiseBannerModel.findById({
      _id: id,
    });
    if (!isExitAdvertiseBanner) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Advertise Banner Not Found!');
    }

    const { ...updateAdvertiseBannerData }: Partial<IAdvertiseBanner> = payload;
    const { startDate, endDate } = updateAdvertiseBannerData;

    // if you want to update start date
    if (startDate && !endDate) {
      if (new Date(startDate) >= new Date(isExitAdvertiseBanner.endDate)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Advertise Banner Date should be greater than start date!'
        );
      }
    }

    // if you want to update end date
    if (endDate && !startDate) {
      if (new Date(isExitAdvertiseBanner.startDate) >= new Date(endDate)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Advertise Banner Date should be greater than start date!'
        );
      }
    }

    // if you want to update both date
    if (endDate && startDate) {
      if (new Date(startDate) >= new Date(endDate)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'AdvertiseBanner Date should be greater than start date!'
        );
      }
    }

    // upload image if image file has
    if (advertiseBannerImageFile) {
      const advertiseBannerImage =
        (await ImageUploadHelpers.imageUploadToS3BucketForUpdate(
          'ABN',
          'advertise-banner',
          advertiseBannerImageFile.buffer,
          isExitAdvertiseBanner?.imageURL.split('/')
        )) as string;

      updateAdvertiseBannerData['imageURL'] = advertiseBannerImage;
    }

    // update the advertise banner
    let result = null;

    if (Object.keys(payload).length) {
      result = await this.#AdvertiseBannerModel.findOneAndUpdate(
        { _id: id },
        { ...updateAdvertiseBannerData },
        {
          new: true,
        }
      );
    }

    return result;
  };

  // delete advertise banner service
  readonly deleteAdvertiseBanner = async (payload: string) => {
    // check already advertise banner exit, if not throw error
    const isExitAdvertiseBanner = await this.#AdvertiseBannerModel.findById({
      _id: payload,
    });
    if (!isExitAdvertiseBanner) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Advertise Banner Not Found!');
    }

    // delete the advertise banner
    const result = await this.#AdvertiseBannerModel.findByIdAndDelete(payload);
    return result;
  };
}

export const AdvertiseBannerService = new AdvertiseBannerServiceClass();

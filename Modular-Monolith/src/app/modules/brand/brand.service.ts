import httpStatus from 'http-status';
import mongoose from 'mongoose';

import Product from '../product/product.model';
import QueryBuilder from '../../builder/query.builder';
import ApiError from '../../errors/ApiError';
import Brand from './brand.model';

import { IBrand, ICreateBrand } from './brand.interface';
import { brandSearchableFields } from './brand.constant';
import { ImageUploadHelpers } from '../../helpers/image-upload.helper';
import { IFile } from '../../interfaces';

class BrandServiceClass {
  #BrandModel;
  #ProductModel;
  #QueryBuilder: typeof QueryBuilder;
  constructor() {
    this.#BrandModel = Brand;
    this.#ProductModel = Product;
    this.#QueryBuilder = QueryBuilder;
  }
  // create brand service
  readonly createBrand = async (payload: ICreateBrand) => {
    const { name, imageURL, ...other } = payload;
    // check already brand exit, if not, throw error
    const isExitBrand = await this.#BrandModel.findOne({ name: name });

    // check already Brand exit, throw error
    if (isExitBrand) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Brand already Exit!');
    }

    // upload image to aws s3 bucket
    const brandImageURL = await ImageUploadHelpers.imageUploadToS3Bucket(
      'BND',
      'bandImage',
      imageURL.buffer
    );

    const result = await this.#BrandModel.create({
      imageURL: brandImageURL,
      name,
      ...other,
    });

    // if not created brand, throw error
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Brand Create Failed!`);
    }

    return result;
  };

  // get all brands service
  readonly allBrands = async (query: Record<string, unknown>) => {
    const brandQuery = new this.#QueryBuilder(this.#BrandModel.find(), query)
      .search(brandSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

    // result of brand
    const result = await brandQuery.modelQuery;

    // get meta brand
    const meta = await brandQuery.countTotal();

    return {
      meta,
      result,
    };
  };

  // get single brand service
  readonly getSingleBrand = async (payload: string) => {
    const result = await this.#BrandModel.findById(payload).exec();
    return result;
  };

  // update brand service
  readonly updateBrand = async (
    id: string,
    payload: Partial<IBrand>,
    brandImageFile: IFile | null
  ) => {
    // start transaction
    let result = null;
    let session;
    try {
      session = await mongoose.startSession();
      // start a session for the transaction
      session.startTransaction();

      // check already brand exit, if not throw error
      const isExitBrand = await this.#BrandModel.findById({ _id: id });
      if (!isExitBrand) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Brand Not Found!');
      }

      const { ...updatedBrandData }: Partial<IBrand> = payload;

      // upload image if image file has
      if (brandImageFile) {
        const brandImage =
          (await ImageUploadHelpers.imageUploadToS3BucketForUpdate(
            'BND',
            'bandImage',
            brandImageFile.buffer,
            isExitBrand?.imageURL.split('/')
          )) as string;

        updatedBrandData['imageURL'] = brandImage;
      }

      // update the brand
      if (Object.keys(updatedBrandData).length) {
        result = await this.#BrandModel
          .findOneAndUpdate(
            { _id: id },
            { ...updatedBrandData },
            {
              new: true,
            }
          )
          .session(session);
      }

      if (payload.name) {
        await this.#ProductModel
          .updateMany(
            { 'brand.brandId': isExitBrand._id },
            {
              $set: {
                'brand.name': payload?.name,
              },
            },
            { multi: true }
          )
          .session(session);
      }

      // commit the transaction
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      if (session) {
        await session.abortTransaction();
        await session.endSession();
      }

      if (error instanceof ApiError) {
        throw new ApiError(httpStatus.BAD_REQUEST, error?.message);
      } else {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Internal Server Error'
        );
      }
    }

    return result;
  };

  // delete brand service
  readonly deleteBrand = async (payload: string) => {
    // start transaction
    let result = null;
    const session = await mongoose.startSession();
    try {
      // start a session for the transaction
      await session.startTransaction();

      // check already brand exit, if not throw error
      const isExitBrand = await this.#BrandModel.findById({
        _id: payload,
      });
      if (!isExitBrand) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Brand Not Found!');
      }

      // get all products
      const allProducts = await this.#ProductModel.find({
        'brand.brandId': payload,
      });

      // update products brand
      for (let i = 0; allProducts?.length; i++) {
        await this.#ProductModel.findOneAndUpdate(
          {
            _id: allProducts?.[i]?._id,
          },
          {
            $set: {
              brand: {
                name: null,
                brandId: null,
              },
            },
          },
          { session }
        );
      }
      // delete the brand
      const resultBrand = await this.#BrandModel.findOneAndDelete(
        { _id: payload },
        { session }
      );

      result = resultBrand;
      // commit the transaction
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      if (error instanceof ApiError) {
        throw new ApiError(httpStatus.BAD_REQUEST, error?.message);
      } else {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Interval Server Error'
        );
      }
    }

    return result;
  };
}

export const BrandService = new BrandServiceClass();

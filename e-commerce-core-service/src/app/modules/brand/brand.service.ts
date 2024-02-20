import httpStatus from 'http-status';

import QueryBuilder from '../../builder/query.builder';
import ApiError from '../../errors/ApiError';
import Brand from './brand.model';

import { IBrand, ICreateBrand } from './brand.interface';
import { brandSearchableFields } from './brand.constant';
import { ImageUploadHelpers } from '../../helpers/image-upload.helper';
import { IFile } from '../../interfaces';

class BrandServiceClass {
  #BrandModel;
  #QueryBuilder: typeof QueryBuilder;
  constructor() {
    this.#BrandModel = Brand;
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
    const userQuery = new this.#QueryBuilder(this.#BrandModel.find(), query)
      .search(brandSearchableFields)
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
  ): Promise<IBrand | null> => {
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
    let result = null;

    if (Object.keys(updatedBrandData).length) {
      result = await this.#BrandModel.findOneAndUpdate(
        { _id: id },
        { ...updatedBrandData },
        {
          new: true,
        }
      );
    }

    return result;
  };

  // delete brand service
  readonly deleteBrand = async (payload: string) => {
    // check already brand exit, if not throw error
    const isExitBrand = await this.#BrandModel.findById({ _id: payload });
    if (!isExitBrand) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Brand Not Found!');
    }

    // delete the brand
    const result = await this.#BrandModel.findByIdAndDelete(payload);
    return result;
  };
}

export const BrandService = new BrandServiceClass();

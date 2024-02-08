import httpStatus from 'http-status';

import QueryBuilder from '../../builder/query.builder';
import ApiError from '../../errors/ApiError';
import Brand from './brand.model';

import { IBrand } from './brand.interface';
import { brandSearchableFields } from './brand.constant';

class BrandServiceClass {
  #BrandModel;
  #QueryBuilder: typeof QueryBuilder;
  constructor() {
    this.#BrandModel = Brand;
    this.#QueryBuilder = QueryBuilder;
  }
  // create brand service
  readonly createBrand = async (payload: IBrand) => {
    // check already brand exit, if not, throw error
    const isExitBrand = await this.#BrandModel.findOne({ name: payload?.name });

    // check already Brand exit, throw error
    if (isExitBrand) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Brand already Exit!');
    }
    const result = await this.#BrandModel.create(payload);

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
    payload: Partial<IBrand>
  ): Promise<IBrand | null> => {
    // check already brand exit, if not throw error
    const isExitBrand = await this.#BrandModel.findById({ _id: id });
    if (!isExitBrand) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Brand Not Found!');
    }

    const { ...updatedBrandData }: Partial<IBrand> = payload;

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

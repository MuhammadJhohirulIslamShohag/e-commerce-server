import httpStatus from 'http-status';
import mongoose from 'mongoose';

import Product from '../product/product.model';
import Size from './size.model';
import ApiError from '../../errors/ApiError';
import QueryBuilder from '../../builder/query.builder';

import { ISize } from './size.interface';
import { sizeSearchableFields } from './size.constant';

class SizeServiceClass {
  #SizeModel;
  #ProductModel;

  #QueryBuilder: typeof QueryBuilder;
  constructor() {
    this.#SizeModel = Size;
    this.#ProductModel = Product;
    this.#QueryBuilder = QueryBuilder;
  }
  // create size service
  readonly createSize = async (payload: ISize) => {
    // check already size exit, if not, throw error
    const isExitSize = await this.#SizeModel.findOne({ name: payload?.name });
    if (isExitSize) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Size Is Already Exit!`);
    }

    // create new size
    const result = await this.#SizeModel.create(payload);

    // if not created size, throw error
    if (!result) {
      throw new ApiError(httpStatus.CONFLICT, `Size Create Failed!`);
    }

    return result;
  };

  // get all sizes service
  readonly allSizes = async (query: Record<string, unknown>) => {
    const userQuery = new this.#QueryBuilder(this.#SizeModel.find(), query)
      .search(sizeSearchableFields)
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

  // get single size service
  readonly getSingleSize = async (payload: string) => {
    // check size is exit, if not, throw error
    const isExitSize = await this.#SizeModel.findById(payload);
    if (!isExitSize) {
      throw new ApiError(httpStatus.NOT_FOUND, `Size Is Not Exit!`);
    }

    const result = await this.#SizeModel.findById(payload).exec();
    return result;
  };

  // update size service
  readonly updateSize = async (id: string, payload: Partial<ISize>) => {
    // check already size exit, if not throw error
    const isExitSize = await this.#SizeModel.findById({ _id: id });
    if (!isExitSize) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Size Not Found!');
    }

    const updatedSizeData: Partial<ISize> = { ...payload };

    // update the size
    const result = await this.#SizeModel.findOneAndUpdate(
      { _id: id },
      updatedSizeData,
      {
        new: true,
      }
    );

    return result;
  };

  // delete size service
  readonly deleteSize = async (payload: string) => {
    // start transaction
    let result = null;
    const session = await mongoose.startSession();
    try {
      // start a session for the transaction
      await session.startTransaction();

      // check already size exit, if not throw error
      const isExitSize = await this.#SizeModel.findById({
        _id: payload,
      });
      if (!isExitSize) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Size Not Found!');
      }

      // get all products
      const allProducts = await this.#ProductModel.find({
        'size.sizeId': payload,
      });

      // update products size
      for (let i = 0; allProducts.length; i++) {
        await this.#ProductModel.findOneAndUpdate(
          {
            _id: allProducts?.[i]?._id,
          },
          {
            $set: {
              size: {
                name: null,
                sizeId: null,
              },
            },
          },
          { session }
        );
      }
      // delete the size
      const resultSize = await this.#SizeModel.findOneAndDelete(
        { _id: payload },
        { session }
      );

      result = resultSize;
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

export const SizeService = new SizeServiceClass();

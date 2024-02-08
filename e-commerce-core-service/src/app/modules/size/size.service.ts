import httpStatus from 'http-status';

import Size from './size.model';
import ApiError from '../../errors/ApiError';
import QueryBuilder from '../../builder/query.builder';

import { ISize } from './size.interface';
import { sizeSearchableFields } from './size.constant';

class SizeServiceClass {
  #SizeModel;
  #QueryBuilder: typeof QueryBuilder;
  constructor() {
    this.#SizeModel = Size;
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
    // check already size exit, if not throw error
    const isExitSize = await this.#SizeModel.findById({ _id: payload });
    if (!isExitSize) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Size Not Found!');
    }

    // delete the size
    const result = await this.#SizeModel.findByIdAndDelete(payload);
    return result;
  };
}

export const SizeService = new SizeServiceClass();

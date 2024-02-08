import httpStatus from 'http-status';

import QueryBuilder from '../../builder/query.builder';
import ApiError from '../../errors/ApiError';
import Color from './color.model';

import { IColor } from './color.interface';
import { colorSearchableFields } from './color.constant';

class ColorServiceClass {
  #ColorModel;
  #QueryBuilder: typeof QueryBuilder;
  constructor() {
    this.#ColorModel = Color;
    this.#QueryBuilder = QueryBuilder;
  }
  // create color service
  readonly createColor = async (payload: IColor) => {
    // check already color exit, if not, throw error
    const isExitColor = await this.#ColorModel.findOne({ name: payload?.name });
    if (isExitColor) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Color Is Already Exit!`);
    }

    // create new color
    const result = await this.#ColorModel.create(payload);

    // if not created color, throw error
    if (!result) {
      throw new ApiError(httpStatus.CONFLICT, `Color Create Failed!`);
    }
    return result;
  };

  // get all Colors service
  readonly allColors = async (query: Record<string, unknown>) => {
    const userQuery = new this.#QueryBuilder(this.#ColorModel.find(), query)
      .search(colorSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

    // result of colors
    const result = await userQuery.modelQuery;

    // get meta colors
    const meta = await userQuery.countTotal();

    return {
      meta,
      result,
    };
  };

  // get single color service
  readonly getSingleColor = async (payload: string) => {
    const result = await this.#ColorModel.findById(payload).exec();
    return result;
  };

  // update color service
  readonly updateColor = async (id: string, payload: Partial<IColor>) => {
    // check already color exit, if not throw error
    const isExitColor = await this.#ColorModel.findById({ _id: id });
    if (!isExitColor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Color Not Found!');
    }

    const updatedColorData: Partial<IColor> = { ...payload };

    // update the color
    const result = await this.#ColorModel.findOneAndUpdate(
      { _id: id },
      updatedColorData,
      {
        new: true,
      }
    );

    return result;
  };

  // delete color service
  readonly deleteColor = async (payload: string) => {
    // check already color exit, if not throw error
    const isExitColor = await this.#ColorModel.findById({ _id: payload });
    if (!isExitColor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Color Not Found!');
    }

    // delete the color
    const result = await this.#ColorModel.findByIdAndDelete(payload);
    return result;
  };
}

export const ColorService = new ColorServiceClass();

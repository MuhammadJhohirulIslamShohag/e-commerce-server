import mongoose from 'mongoose';
import httpStatus from 'http-status';

import QueryBuilder from '../../builder/query.builder';
import ApiError from '../../errors/ApiError';
import Color from './color.model';
import Product from '../product/product.model';

import { IColor } from './color.interface';
import { colorSearchableFields } from './color.constant';

class ColorServiceClass {
  #ColorModel;
  #ProductModel;
  #QueryBuilder: typeof QueryBuilder;
  constructor() {
    this.#ColorModel = Color;
    this.#ProductModel = Product;
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
    const colorQuery = new this.#QueryBuilder(this.#ColorModel.find(), query)
      .search(colorSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

    // result of colors
    const result = await colorQuery.modelQuery;

    // get meta colors
    const meta = await colorQuery.countTotal();

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
    // start transaction
    let result = null;
    let session;
    try {
      session = await mongoose.startSession();
      // start a session for the transaction
      session.startTransaction();

      // check already color exit, if not throw error
      const isExitColor = await this.#ColorModel.findById({ _id: id });
      if (!isExitColor) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Color Not Found!');
      }

      const updatedColorData: Partial<IColor> = { ...payload };

      // update the color
      result = await this.#ColorModel
        .findOneAndUpdate({ _id: id }, updatedColorData, {
          new: true,
        })
        .session(session);

      if (payload?.name) {
        await this.#ProductModel
          .updateMany(
            { 'colors.colorId': isExitColor._id },
            {
              $set: {
                'colors.$.name': payload?.name,
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

  // delete color service
  readonly deleteColor = async (payload: string) => {
    // start transaction
    let result = null;
    const session = await mongoose.startSession();
    try {
      // start a session for the transaction
      await session.startTransaction();

      // check already color exit, if not throw error
      const isExitColor = await this.#ColorModel.findById({
        _id: payload,
      });
      if (!isExitColor) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Color Not Found!');
      }

      // get all products
      const allProducts = await this.#ProductModel.find({
        'color.colorId': payload,
      });

      // update products color
      for (let i = 0; allProducts?.length; i++) {
        await this.#ProductModel.findOneAndUpdate(
          {
            _id: allProducts?.[i]?._id,
          },
          {
            $set: {
              color: {
                name: null,
                colorId: null,
              },
            },
          },
          { session }
        );
      }
      // delete the color
      const resultColor = await this.#ColorModel.findOneAndDelete(
        { _id: payload },
        { session }
      );

      result = resultColor;
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

export const ColorService = new ColorServiceClass();

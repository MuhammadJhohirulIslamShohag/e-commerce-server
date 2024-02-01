/* eslint-disable no-unused-expressions */
import httpStatus from 'http-status';
import mongoose from 'mongoose';

import SubCategory from './subCategory.model';
import QueryBuilder from '../../builder/query.builder';
import ApiError from '../../errors/ApiError';

import { subCategorySearchableFields } from './subCategory.constant';
import { ISubCategory } from './subCategory.interface';

class SubCategoryServiceClass {
  #SubCategoryModel;
  #QueryBuilder: typeof QueryBuilder;

  constructor() {
    this.#SubCategoryModel = SubCategory;
    this.#QueryBuilder = QueryBuilder;
  }

  // create sub category method
  readonly createSubCategory = async (payload: ISubCategory) => {
    // check already sub category exit, if not, throw error
    const isExitSubCategory = await this.#SubCategoryModel.findOne({
      name: payload?.name,
    });
    if (isExitSubCategory) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Sub Category Is Already Exit!`
      );
    }

    // create new sub category
    const result = await this.#SubCategoryModel.create(payload);
    
    // if not created sub category, throw error
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Sub Category Create Failed!`);
    }
    return result;
  };

  // get all sub categories method
  readonly allSubCategories = async (query: Record<string, unknown>) => {
    const userQuery = new this.#QueryBuilder(
      this.#SubCategoryModel.find(),
      query
    )
      .search(subCategorySearchableFields)
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

  // get single sub category method
  readonly getSingleSubCategory = async (payload: string) => {
    const result = await this.#SubCategoryModel
      .findById(payload)
      .populate('categories.categoryId')
      .exec();
    return result;
  };

  // update sub category method
  readonly updateSubCategory = async (
    id: string,
    payload: Partial<ISubCategory>
  ) => {
    // check already sub category exit, if not throw error
    const isExitSubCategory = await this.#SubCategoryModel.findById({
      _id: id,
    });
    if (!isExitSubCategory) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Sub Category Not Found!');
    }

    const updatedSubCategoryData: Partial<ISubCategory> = { ...payload };

    // update the sub category
    const result = await this.#SubCategoryModel.findOneAndUpdate(
      { _id: id },
      updatedSubCategoryData,
      {
        new: true,
      }
    );

    return result;
  };

  // delete sub category method
  readonly deleteSubCategory = async (
    productId: string,
    subCategoryId: string
  ) => {
    // check already sub category exit, if not throw error
    const isExitSubCategory = await this.#SubCategoryModel.findById({
      _id: subCategoryId,
    });
    if (!isExitSubCategory) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Sub Category Not Found!');
    }

    // start transaction
    let result = null;
    const session = await mongoose.startSession();
    try {
      // start a session for the transaction
      session.startTransaction();

      // delete sub category
      const subCategoryResult = await this.#SubCategoryModel.findByIdAndDelete(
        {
          _id: subCategoryId,
        },
        { session }
      );

      // delete sub category to product
      // await Product.findOneAndUpdate(
      //   { _id: productId, 'subCategories._id': subCategoryId },
      //   {
      //     $pull: {
      //       subCategories: {
      //         _id: subCategoryId,
      //       },
      //     },
      //   },
      //   {
      //     new: true,
      //     session,
      //   }
      // );

      result = subCategoryResult;
      // commit the transaction
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
    }
    return result;
  };

  // get categories from sub category method
  readonly allSubCategoriesUnderCategories = async () => {
    const result = await this.#SubCategoryModel.aggregate([
      {
        $unwind: {
          path: '$categories',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories.categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $group: {
          _id: '$categories.categoryId',
          subCategories: {
            $push: {
              id: '$_id',
              name: '$name',
            },
          },
          name: {
            $first: {
              $arrayElemAt: ['$category.name', 0],
            },
          },
        },
      },
      {
        $project: {
          id: '$_id',
          subCategories: 1,
          name: 1,
        },
      },
      {
        $unset: '_id',
      },
    ]);

    return result;
  };
}

export const SubCategoryService = new SubCategoryServiceClass();

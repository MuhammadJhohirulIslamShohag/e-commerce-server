import httpStatus from 'http-status';
import mongoose from 'mongoose';

import SubCategory from './subCategory.model';
import QueryBuilder from '../../builder/query.builder';
import ApiError from '../../errors/ApiError';
import Product from '../product/product.model';

import { subCategorySearchableFields } from './subCategory.constant';
import { ISubCategory, ICreateSubCategory } from './subCategory.interface';
import { ImageUploadHelpers } from '../../helpers/image-upload.helper';
import { IFile } from '../../interfaces';

class SubCategoryServiceClass {
  #SubCategoryModel;
  #ProductModel;
  #QueryBuilder: typeof QueryBuilder;

  constructor() {
    this.#SubCategoryModel = SubCategory;
    this.#ProductModel = Product;
    this.#QueryBuilder = QueryBuilder;
  }

  // create sub category method
  readonly createSubCategory = async (payload: ICreateSubCategory) => {
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

    // upload image to aws s3 bucket
    const imageURL = await ImageUploadHelpers.imageUploadToS3Bucket(
      'SCA',
      'subCategoryImage',
      payload.imageURL.buffer
    );

    // create new sub category
    const result = await this.#SubCategoryModel.create({
      name: payload.name,
      imageURL,
      categoryId: payload.categoryId,
    });

    // if not created sub category, throw error
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Sub Category Create Failed!`);
    }
    return result;
  };

  // get all sub categories method
  readonly allSubCategories = async (query: Record<string, unknown>) => {
    const subCategoryQuery = new this.#QueryBuilder(
      this.#SubCategoryModel.find(),
      query
    )
      .search(subCategorySearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields()
      .populate();

    // result of subCategory
    const result = await subCategoryQuery.modelQuery;

    // get meta subCategory
    const meta = await subCategoryQuery.countTotal();

    return {
      meta,
      result,
    };
  };

  // get single sub category method
  readonly getSingleSubCategory = async (payload: string) => {
    const result = await this.#SubCategoryModel
      .findOne({ name: payload })
      .populate('categoryId')
      .exec();
    return result;
  };

  // update sub category method
  readonly updateSubCategory = async (
    id: string,
    payload: Partial<ISubCategory>,
    subCategoryImageFile: IFile | null
  ) => {
    // check already sub category exit, if not throw error
    const isExitSubCategory = await this.#SubCategoryModel.findById({
      _id: id,
    });
    if (!isExitSubCategory) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Sub Category Not Found!');
    }

    const { ...updatedSubCategoryData }: Partial<ISubCategory> = payload;

    // upload image if image file has
    if (subCategoryImageFile) {
      const subCategoryImage =
        (await ImageUploadHelpers.imageUploadToS3BucketForUpdate(
          'SCA',
          'subCategoryImage',
          subCategoryImageFile.buffer,
          isExitSubCategory?.imageURL.split('/')
        )) as string;

      updatedSubCategoryData['imageURL'] = subCategoryImage;
    } else {
      updatedSubCategoryData['imageURL'] = isExitSubCategory?.imageURL;
    }

    // update the sub category
    const result = await this.#SubCategoryModel.findOneAndUpdate(
      { _id: id },
      { ...updatedSubCategoryData },
      {
        new: true,
      }
    );

    return result;
  };

  // delete sub category method
  readonly deleteSubCategory = async (subCategoryId: string) => {
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
      const subCategoryResult = await this.#SubCategoryModel.findOneAndDelete(
        {
          _id: subCategoryId,
        },
        { session }
      );

      // get all products
      const allProducts = await this.#ProductModel.find({
        'subCategories.subCategoryId': subCategoryId,
      });

      // update products sub category
      for (let i = 0; allProducts?.length; i++) {
        // delete sub category to product
        await this.#ProductModel.findOneAndUpdate(
          { _id: allProducts?.[i]?._id },
          {
            $pull: {
              subCategories: {
                _id: subCategoryId,
              },
            },
          },
          {
            new: true,
            session,
          }
        );
      }

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

  // get sub categories under categories from category method
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
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $group: {
          _id: '$categoryId',
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

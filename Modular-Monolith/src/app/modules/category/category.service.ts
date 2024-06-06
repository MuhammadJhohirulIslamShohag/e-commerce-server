import httpStatus from 'http-status';
import mongoose from 'mongoose';

import Product from '../product/product.model';
import Category from './category.model';
import QueryBuilder from '../../builder/query.builder';
import ApiError from '../../errors/ApiError';

import { ICreateCategory, ICategory } from './category.interface';
import { categorySearchableFields } from './category.constant';
import { ImageUploadHelpers } from '../../helpers/image-upload.helper';
import { IFile } from '../../interfaces';

class CategoryServiceClass {
  #CategoryModel;
  #ProductModel;
  #QueryBuilder: typeof QueryBuilder;

  constructor() {
    this.#CategoryModel = Category;
    this.#ProductModel = Product;
    this.#QueryBuilder = QueryBuilder;
  }

  // create category method
  readonly createCategory = async (payload: ICreateCategory) => {
    const { name } = payload;

    const isExitCategory = await this.#CategoryModel.findOne({ name: name });

    if (isExitCategory) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Category already Exit!');
    }

    // upload image to aws s3 bucket
    const imageUrls: string[] = [];

    for (const imgFile of payload.imageURLs) {
      const productImageURL = await ImageUploadHelpers.imageUploadToS3Bucket(
        'CAT',
        'category',
        imgFile.buffer
      );
      imageUrls.push(productImageURL);
    }

    const result = await this.#CategoryModel.create({
      name,
      imageURLs: imageUrls,
    });

    // if not created Category, throw error
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Category Create Failed!`);
    }

    return result;
  };

  // get all categories method
  readonly allCategories = async (query: Record<string, unknown>) => {
    const categoryQuery = new this.#QueryBuilder(
      this.#CategoryModel.find(),
      query
    )
      .search(categorySearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

    // result of category
    const result = await categoryQuery.modelQuery;

    // get meta category
    const meta = await categoryQuery.countTotal();

    return {
      meta,
      result,
    };
  };

  // get single category method
  readonly getSingleCategory = async (payload: string) => {
    const result = await this.#CategoryModel.findOne({ name: payload }).exec();
    return result;
  };

  // update category method
  readonly updateCategory = async (
    id: string,
    payload: Partial<ICategory>,
    categoryImageFile: IFile[] | null
  ) => {
    // start transaction
    let result = null;
    let session;
    try {
      session = await mongoose.startSession();
      // start a session for the transaction
      session.startTransaction();
      // check already Category exit, if not throw error
      const isExitCategory = await this.#CategoryModel.findById({ _id: id });
      if (!isExitCategory) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category Not Found!');
      }

      const { ...updatedCategoryData }: Partial<ICategory> = payload;

      // image update
      const updatedImages = updatedCategoryData?.imageURLs as string[];
      const oldImages = isExitCategory.imageURLs;

      const newImageUrls =
        await ImageUploadHelpers.imageUploadsToS3BucketForUpdate__V2(
          updatedImages,
          oldImages,
          categoryImageFile,
          'category',
          'CAT'
        );

      updatedCategoryData['imageURLs'] = newImageUrls;

      // update the category
      if (Object.keys(updatedCategoryData).length) {
        result = await this.#CategoryModel
          .findOneAndUpdate(
            { _id: id },
            { ...updatedCategoryData },
            {
              new: true,
            }
          )
          .session(session);
      }

      if (payload?.name) {
        await this.#ProductModel
          .updateMany(
            { 'category.categoryId': isExitCategory._id },
            {
              $set: {
                'category.name': payload?.name,
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

  // delete category method
  readonly deleteCategory = async (payload: string) => {
    // start transaction
    let result = null;
    const session = await mongoose.startSession();
    try {
      // start a session for the transaction
      await session.startTransaction();

      // check already category exit, if not throw error
      const isExitCategory = await this.#CategoryModel.findById({
        _id: payload,
      });
      if (!isExitCategory) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category Not Found!');
      }

      // get all products
      const allProducts = await this.#ProductModel.find({
        'category.categoryId': payload,
      });

      // update products category
      for (let i = 0; allProducts?.length; i++) {
        await this.#ProductModel.findOneAndUpdate(
          {
            _id: allProducts?.[i]?._id,
          },
          {
            $set: {
              category: {
                name: null,
                categoryId: null,
              },
            },
          },
          { session }
        );
      }
      // delete the category
      const resultCategory = await this.#CategoryModel.findOneAndDelete(
        { _id: payload },
        { session }
      );

      result = resultCategory;
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

  // get get categories menu from category method
  readonly getCategoriesMenu = async () => {
    const result = await this.#CategoryModel.aggregate([
      {
        $lookup: {
          from: 'subcategories',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'subcategories',
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          id: '$_id',
          subcategories: {
            $map: {
              input: '$subcategories',
              as: 'subcategory',
              in: {
                id: '$$subcategory._id',
                name: '$$subcategory.name',
              },
            },
          },
        },
      },
    ]);
    return result;
  };
}

export const CategoryService = new CategoryServiceClass();

import httpStatus from 'http-status';

import Category from './category.model';
import QueryBuilder from '../../builder/query.builder';
import ApiError from '../../errors/ApiError';

import { CreateCategory, ICategory } from './category.interface';
import { categorySearchableFields } from './category.constant';

class CategoryServiceClass {
  #CategoryModel;
  #QueryBuilder: typeof QueryBuilder;

  constructor() {
    this.#CategoryModel = Category;
    this.#QueryBuilder = QueryBuilder;
  }

  // create category method
  readonly createCategory = async (payload: CreateCategory) => {
    const { name } = payload;

    const isExitCategory = await this.#CategoryModel.findOne({ name: name });

    if (isExitCategory) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Category already Exit!');
    }
    const result = await this.#CategoryModel.create(payload);

    // if not created Category, throw error
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Category Create Failed!`);
    }

    return result;
  };

  // get all categories method
  readonly allCategories = async (query: Record<string, unknown>) => {
    const userQuery = new this.#QueryBuilder(this.#CategoryModel.find(), query)
      .search(categorySearchableFields)
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

  // get single category method
  readonly getSingleCategory = async (payload: string) => {
    const result = await this.#CategoryModel.findById(payload).exec();
    return result;
  };

  // update category method
  readonly updateCategory = async (id: string, payload: Partial<ICategory>) => {
    // check already Category exit, if not throw error
    const isExitCategory = await this.#CategoryModel.findById({ _id: id });
    if (!isExitCategory) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Category Not Found!');
    }

    const { ...updatedCategoryData }: Partial<ICategory> = payload;

    // update the category
    let result = null;

    if (Object.keys(updatedCategoryData).length) {
      result = await this.#CategoryModel.findOneAndUpdate(
        { _id: id },
        { ...updatedCategoryData },
        {
          new: true,
        }
      );
    }
    return result;
  };

  // delete category method
  readonly deleteCategory = async (payload: string) => {
    // check already category exit, if not throw error
    const isExitCategory = await this.#CategoryModel.findById({ _id: payload });
    if (!isExitCategory) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Category Not Found!');
    }

    // delete the category
    const result = await this.#CategoryModel.findByIdAndDelete(payload);
    return result;
  };

  // get subcategories from category method
  readonly allCategoriesUnderSubcategories = async () => {
    const result = await this.#CategoryModel.aggregate([
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subCategories.subCategoryId',
          foreignField: '_id',
          as: 'subCategories',
        },
      },
      {
        $project: {
          id: '$_id',
          name: 1,
          subCategories: {
            $map: {
              input: '$subCategories',
              as: 'subCategory',
              in: {
                id: '$categories._id',
                name: '$categories.name',
              },
            },
          },
        },
      },
      {
        $unset: '_id',
      },
    ]);
    return result;
  };
}

export const CategoryService = new CategoryServiceClass();

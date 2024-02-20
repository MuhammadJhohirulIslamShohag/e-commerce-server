import httpStatus from 'http-status';
import mongoose, { SortOrder, Types } from 'mongoose';

import { productSearchableFields } from './product.constant';
import {
  IProduct,
  ProductFilters,
  ProductReviewDataType,
  ProductSubCategoryDataType,
} from './product.interface';
import Product from './product.model';
import Category from '../category/category.model';
import QueryBuilder from '../../builder/query.builder';
import ApiError from '../../errors/ApiError';
import SubCategory from '../subCategory/subCategory.model';

class ProductServiceClass {
  #ProductModel;
  #QueryBuilder: typeof QueryBuilder;
  constructor() {
    this.#ProductModel = Product;
    this.#QueryBuilder = QueryBuilder;
  }

  /* --------- create product service --------- */
  readonly createProduct = async (
    payload: IProduct
  ): Promise<IProduct | null> => {
    // start transaction
    let result = null;
    const session = await mongoose.startSession();
    try {
      // start a session for the transaction
      await session.startTransaction();

      const isExitProduct: any = await Product.findOne({ name: payload?.name });

      // if not exit product, throw error
      if (isExitProduct) {
        throw new ApiError(httpStatus.CONFLICT, 'Product already Exit!');
      }

      // check price, is negative or not
      if (payload?.price <= 0) {
        throw new ApiError(
          httpStatus.CONFLICT,
          'Price must not be negative or zero!'
        );
      }

      // check quantity, is negative or not
      if (payload?.quantity <= 0) {
        throw new ApiError(
          httpStatus.CONFLICT,
          'Quantity must not be negative or zero!'
        );
      }

      // check discount
      if (payload?.discount <= 0 && payload?.discount > 100) {
        throw new ApiError(
          httpStatus.CONFLICT,
          'Discount must be greater than or equal to 0 and less than 100!'
        );
      }

      // create product
      const productResult = await Product.create([payload], { session });

      if (!productResult.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Product create failed!');
      }

      result = productResult[0];
      // commit the transaction
      await session.commitTransaction();
      await session.endSession();
    } catch (error: any) {
      // console.log(error)
      await session.abortTransaction();
      await session.endSession();
      if (error) {
        throw new ApiError(
          httpStatus.CONFLICT,
          error?.message || "Can't create"
        );
      }
    }

    return result;
  };

  /* --------- add sub category to product service --------- */
  readonly addSubCategoryToProduct = async (
    id: string,
    payload: ProductSubCategoryDataType
  ) => {
    // check sub category is exit, if not throw error
    const isExitSubCategory = await Product.findOne({
      _id: id,
      'subCategories.name': payload?.name,
    });

    // check sub category is exit to stock, if not throw error
    if (isExitSubCategory) {
      throw new ApiError(httpStatus.CONFLICT, 'Sub Category Already Exit!');
    }

    // start transaction
    let result = null;
    const session = await mongoose.startSession();
    try {
      // start a session for the transaction
      await session.startTransaction();

      // sub category object
      const subCategoryObject = {
        name: payload?.name,
        description: payload?.description,
        imageURL: payload?.imageURL,
      };

      // create sub category
      const subCategoryArray = await SubCategory.create([subCategoryObject], {
        session,
      });

      if (!subCategoryArray.length) {
        throw new ApiError(httpStatus.CONFLICT, 'Sub Category created failed!');
      }

      const subCategory = subCategoryArray[0];

      // push sub category to product
      result = await Product.findOneAndUpdate(
        { _id: id, 'subCategories.name': payload?.name },
        {
          $push: {
            subCategories: {
              name: payload?.name,
              subCategoryId: subCategory?._id,
            },
          },
        },
        {
          new: true,
          session,
        }
      );

      // commit the transaction
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
    }

    return result;
  };

  /* --------- add review to to product service --------- */
  readonly addReviewToProduct = async (
    id: string,
    payload: ProductReviewDataType
  ): Promise<IProduct | null> => {
    // check review is exit, if not throw error
    const isExitReview = await Product.findOne({
      _id: id,
      'reviews.email': payload?.review?.email,
    });

    if (isExitReview) {
      throw new ApiError(httpStatus.CONFLICT, 'Review Already Exit!');
    }

    // start transaction
    let result = null;
    const session = await mongoose.startSession();
    try {
      // start a session for the transaction
      await session.startTransaction();

      // review object
      const reviewObject = {
        product: {
          productId: id,
        },
        rating: payload?.rating,
        review: {
          userId: payload?.review?.userId,
          comment: payload?.review?.comment,
        },
      };

      // create review
      const reviewArray = await Review.create([reviewObject], { session });
      if (!reviewArray.length) {
        throw new ApiError(httpStatus.CONFLICT, 'Review created failed!');
      }
      const review = reviewArray[0];

      // push review to product
      result = await Product.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            reviews: {
              email: payload?.review?.email,
              reviewId: review?._id,
            },
          },
        },
        {
          new: true,
          session,
        }
      );
      // commit the transaction
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
    }

    return result;
  };


  /* --------- get all products service --------- */
 readonly allProducts = async (
    paginationOption: PaginationOptionType,
    filters: ProductFilters
  ): Promise<IGenericResponse<IProduct[]>> => {
    const { page, limit, sortBy, sortOrder, skip } =
      paginationHelper.calculatePagination(paginationOption);

    // exact search term
    const { searchTerm, minPrice, maxPrice, ...filterData } = filters;

    const andConditions = [];

    // searching specific filed with dynamic way
    if (searchTerm?.trim() !== '' && searchTerm !== undefined) {
      andConditions.push({
        $or: productSearchableFields.map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      });
    }

    // filtering price range
    if (minPrice || maxPrice) {
      // check price is number or string value, if string, throw error
      if (isNaN(Number(minPrice)) || isNaN(Number(maxPrice))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Price Range Value');
      }

      const priceCondition: Partial<{
        price: { $gte?: number; $lte?: number };
      }> = {};

      if (minPrice) {
        priceCondition.price = {
          $gte: Number(minPrice),
        };
      }

      if (maxPrice) {
        priceCondition.price = {
          ...priceCondition.price,
          $lte: Number(maxPrice),
        };
      }
      andConditions.push(priceCondition);
    }

    // exact filtering with dynamic way
    if (Object.keys(filterData)?.length) {
      andConditions.push({
        $and: Object.keys(filterData).map(key => {
          if (
            (filterData as any)[key]?.trim() !== '' &&
            (filterData as any)[key] !== undefined
          ) {
            return {
              [key as any]: (filterData as any)[key],
            };
          } else {
            return {};
          }
        }),
      });
    }

    // dynamic sorting
    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) [(sortConditions[sortBy] = sortOrder)];

    const whereConditions =
      andConditions.length > 0 ? { $and: andConditions } : {};
    // result of product
    const result = await Product.find(whereConditions)
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

    // get total products
    const total = await Product.countDocuments(whereConditions);

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  };

  /* --------- get products by category service --------- */
 readonly getProductsByCategory = async (
    paginationOption: PaginationOptionType,
    categoryId: string
  ): Promise<IGenericResponse<IProduct[]>> => {
    const { page, limit, sortBy, sortOrder, skip } =
      paginationHelper.calculatePagination(paginationOption);

    // dynamic sorting
    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) [(sortConditions[sortBy] = sortOrder)];
    // start transaction
    let result = null;
    let total = 0;
    const session = await mongoose.startSession();
    try {
      // start a session for the transaction
      await session.startTransaction();

      const category = await Category.findById({ _id: categoryId });

      // Handle the case when the product is not found
      if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Category Not Found!');
      }

      // Increment the view count
      category.clickedCount += 1;

      // Save the updated product
      await category.save();

      result = await Product.find({ 'category.categoryId': categoryId })
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

      // get total products
      total = await Product.countDocuments({
        'category.categoryId': categoryId,
      });

      // commit the transaction
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
    }

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  };

  /* --------- get products by sub category service --------- */
  readonly getProductsBySubCategory = async (
    paginationOption: PaginationOptionType,
    subCategoryId: string
  ) => {
    const { page, limit, sortBy, sortOrder, skip } =
      paginationHelper.calculatePagination(paginationOption);

    // dynamic sorting
    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) [(sortConditions[sortBy] = sortOrder)];

    let result = null;
    let total = 0;

    const aggregateData = await Product.aggregate([
      {
        $unwind: {
          path: '$subCategories',
        },
      },
      {
        $match: {
          'subCategories.subCategoryId': new Types.ObjectId(subCategoryId),
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    result = aggregateData;

    // get total products
    const totalProducts = await Product.aggregate([
      {
        $unwind: {
          path: '$subCategories',
        },
      },
      {
        $match: {
          'subCategories.subCategoryId': new Types.ObjectId(subCategoryId),
        },
      },
    ]);

    total = totalProducts.length;

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  };

  /* --------- get single product service --------- */
  readonly getSingleProduct = async (payload: string) => {
    const product = await Product.findById(payload);

    // Handle the case when the product is not found
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product Not Found!');
    }

    // Increment the view count
    product.clickedProductCount += 1;

    // Save the updated product
    await product.save();

    return product;
  };
  // get single product by title
  readonly getSingleProductByTitle = async (payload: string) => {
    const product = await Product.findOne({ name: payload });

    // Handle the case when the product is not found
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product Not Found!');
    }

    // Increment the view count
    product.clickedProductCount += 1;

    // Save the updated product
    await product.save();

    return product;
  };

  /* --------- update product service --------- */
 readonly updateProduct = async (id: string, payload: Partial<IProduct>) => {
    // check already product exit, if not throw error
    const isExitProduct = await Product.findOne({ _id: id });

    if (!isExitProduct) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product Not Found!');
    }

    const { category, brand, color, size, ...others } = payload;

    const updatedProductData: Partial<IProduct> = { ...others };

    // check price, is negative or not
    if (others?.price && others?.price <= 0) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Price must not be negative or zero!'
      );
    }

    // check quantity, is negative or not
    if (others?.quantity && others?.quantity <= 0) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Quantity must not be negative or zero!'
      );
    }

    // check discount
    if (others?.discount && others?.discount <= 0 && others?.discount > 100) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Discount must be greater than or equal to 0 and less than 100!'
      );
    }

    // category update
    if (category && Object.keys(category).length > 0) {
      Object.keys(category).map(key => {
        const categoryKey = `category.${key}` as keyof Partial<IProduct>;
        (updatedProductData as any)[categoryKey] =
          category[key as keyof typeof category];
      });
    }

    // brand update
    if (brand && Object.keys(brand).length > 0) {
      Object.keys(brand).map(key => {
        const brandKey = `brand.${key}` as keyof Partial<IProduct>;
        (updatedProductData as any)[brandKey] =
          brand[key as keyof typeof brand];
      });
    }

    // color update
    if (color && Object.keys(color).length > 0) {
      Object.keys(color).map(key => {
        const colorKey = `color.${key}` as keyof Partial<IProduct>;
        (updatedProductData as any)[colorKey] =
          color[key as keyof typeof color];
      });
    }

    // size update
    if (size && Object.keys(size).length > 0) {
      Object.keys(size).map(key => {
        const sizeKey = `size.${key}` as keyof Partial<IProduct>;
        (updatedProductData as any)[sizeKey] = size[key as keyof typeof size];
      });
    }

    // update the product and stock
    let resultForProduct = null;

    // start transaction
    const session = await mongoose.startSession();
    try {
      await session.startTransaction();

      // update product and stock
      if (Object.keys(updatedProductData)?.length) {
        resultForProduct = await Product.findOneAndUpdate(
          { _id: id },
          { ...updatedProductData },
          {
            new: true,
            session,
          }
        );
      }

      // commit transaction
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
    }

    return {
      resultForProduct,
    };
  };

  /* --------- delete product service --------- */
  readonly deleteProduct = async (
    payload: string
  ) => {
    // check already product exit, if not throw error
    const isExitProduct = await Product.findById({ _id: payload });
    if (!isExitProduct) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product Not Found!');
    }
    // delete the Product
    const result = await Product.findByIdAndDelete(payload);
    return result;
  };
}

export const ProductService = new ProductServiceClass();

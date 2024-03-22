import httpStatus from 'http-status';
import mongoose, { SortOrder, Types } from 'mongoose';

import Product from './product.model';
import Category from '../category/category.model';
import Review from '../review/review.model';
import ApiError from '../../errors/ApiError';
import QueryBuilder from '../../builder/query.builder';

import { ICreateProduct, IProduct } from './product.interface';
import { paginationHelper } from '../../helpers/pagination.helper';
import { PaginationOptionType } from '../../interfaces/pagination';
import { ImageUploadHelpers } from '../../helpers/image-upload.helper';
import { productSearchableFields } from './product.constant';
import { customSlug } from '../../shared/customSlug';

class ProductServiceClass {
  #ProductModel;
  #ReviewModel;
  #QueryBuilder: typeof QueryBuilder;

  constructor() {
    this.#ProductModel = Product;
    this.#ReviewModel = Review;
    this.#QueryBuilder = QueryBuilder;
  }

  /* --------- create product service --------- */
  readonly createProduct = async (payload: ICreateProduct) => {
    // start transaction
    let result = null;
    const session = await mongoose.startSession();
    try {
      // start a session for the transaction
      await session.startTransaction();

      const { imageURLs } = payload;
      const isExitProduct = await this.#ProductModel.findOne({
        name: payload?.name,
      });

      // if not exit product, throw error
      if (isExitProduct) {
        throw new ApiError(httpStatus.CONFLICT, 'Product already Exit!');
      }

      // check price, is negative or not
      if (Number(payload?.price) <= 0) {
        throw new ApiError(
          httpStatus.CONFLICT,
          'Price must not be negative or zero!'
        );
      }

      // check quantity, is negative or not
      if (Number(payload?.quantity) <= 0) {
        throw new ApiError(
          httpStatus.CONFLICT,
          'Quantity must not be negative or zero!'
        );
      }

      // check discount
      if (Number(payload?.discount) <= 0 && Number(payload?.discount) > 100) {
        throw new ApiError(
          httpStatus.CONFLICT,
          'Discount must be greater than or equal to 0 and less than 100!'
        );
      }

      // upload image to aws s3 bucket
      const imageUrls: string[] = [];

      for (const imgFile of imageURLs) {
        const productImageURL = await ImageUploadHelpers.imageUploadToS3Bucket(
          'PRD',
          'productImage',
          imgFile.buffer
        );
        imageUrls.push(productImageURL);
      }

      const slug = customSlug(payload.name);

      // create product
      const productResult = await this.#ProductModel.create(
        [{ ...payload, imageURLs: imageUrls, slug: slug }],
        {
          session,
        }
      );

      if (!productResult.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Product create failed!');
      }

      result = productResult[0];
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

  /* --------- get all products service --------- */
  readonly allProducts = async (query: Record<string, unknown>) => {
    const productQuery = new this.#QueryBuilder(
      this.#ProductModel.find(),
      query
    )
      .search(productSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields()
      .populate();

    // result of product
    const result = await productQuery.modelQuery;

    // get meta product
    const meta = await productQuery.countTotal();

    return {
      meta,
      result,
    };
  };

  /* --------- get products by category service --------- */
  readonly getProductsByCategory = async (
    paginationOption: PaginationOptionType,
    categoryId: string
  ) => {
    const { page, limit, sortBy, sortOrder, skip } =
      paginationHelper.calculatePagination(paginationOption);

    // dynamic sorting
    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) sortConditions[sortBy] = sortOrder;
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

      result = await this.#ProductModel
        .find({ 'category.categoryId': categoryId })
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

      // get total products
      total = await this.#ProductModel.countDocuments({
        'category.categoryId': categoryId,
      });

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

    if (sortBy && sortOrder) sortConditions[sortBy] = sortOrder;

    let result = null;
    let total = 0;

    const aggregateData = await this.#ProductModel.aggregate([
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
    const totalProducts = await this.#ProductModel.aggregate([
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
    const product = await this.#ProductModel.findById(payload);

    // handle the case when the product is not found
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product Not Found!');
    }

    // increment the view count
    product.clickedProductCount += 1;

    // save the updated product
    await product.save();

    return product;
  };

  /* --------- update product service --------- */
  readonly updateProduct = async (id: string, payload: Partial<IProduct>) => {
    // check already product exit, if not throw error
    const isExitProduct = await this.#ProductModel.findOne({ _id: id });

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

    // update product and stock
    if (Object.keys(updatedProductData)?.length) {
      resultForProduct = await this.#ProductModel.findOneAndUpdate(
        { _id: id },
        { ...updatedProductData },
        {
          new: true,
        }
      );
    }

    return resultForProduct;
  };

  /* --------- delete product service --------- */
  readonly deleteProduct = async (payload: string) => {
    // start transaction
    let result = null;
    const session = await mongoose.startSession();
    try {
      await session.startTransaction();
      // check already product exit, if not throw error
      const isExitProduct = await this.#ProductModel.findById({ _id: payload });
      if (!isExitProduct) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product Not Found!');
      }

      // delete the Product
      const resultProduct = await this.#ProductModel.findByIdAndDelete(payload);

      if (!resultProduct) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Product Removed Failed!');
      }

      // delete review under blog
      const review = await this.#ReviewModel.deleteMany(
        { productId: isExitProduct._id },
        { session }
      );

      if (!review) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Review Removed Under Blog Failed!'
        );
      }

      result = resultProduct;

      // commit transaction
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
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

export const ProductService = new ProductServiceClass();

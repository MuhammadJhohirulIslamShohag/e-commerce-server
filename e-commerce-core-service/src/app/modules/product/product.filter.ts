import { PipelineStage, Types } from 'mongoose';

import { paginationHelper } from '../../helpers/pagination.helper';
import { PaginationOptionType } from '../../interfaces/pagination';
import { productSearchableFields } from './product.constant';
import { ProductFilters } from './product.interface';

// get all products by filter service
export const getProductsByFilter = async (
  paginationOption: PaginationOptionType,
  filters: ProductFilters
) => {
  const { limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);

  // explicitly type sortOrder as 1 | -1
  const sortOrderTyped: 1 | -1 = sortOrder == 'desc' ? -1 : (1 as 1 | -1);
  // exact search term
  const { searchTerm, ...filterData } = filters;

  let filterSearchMatch = null;

  // searching specific filed with dynamic way
  if (searchTerm) {
    filterSearchMatch = productSearchableFields.map(field => ({
      [field]: {
        $regex: searchTerm,
        $options: 'i',
      },
    }));
  }

  // exact filtering with dynamic way
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterMatch: { [key: string]: any } = {};

  if (Object.keys(filterData).length) {
    if (typeof filterData.isFeatured === 'string') {
      filterData.isFeatured = filterData.isFeatured === 'false' ? false : true;
    }
    if (typeof filterData.userId === 'string') {
      filterData.userId = new Types.ObjectId(filterData.userId);
    }

    // handle category names filtering
    if (typeof filterData['category.name'] === 'string') {
      const categoryNames = filterData['category.name'].split(',');
      filterMatch['category.name'] = { $in: categoryNames };
    }
    // handle sub category names filtering
    if (typeof filterData['subCategories.name'] === 'string') {
      const subCategoryNames = filterData['subCategories.name'].split(',');
      filterMatch['subCategories.name'] = { $in: subCategoryNames };
    }

    // Handle minPrice and maxPrice separately
    if (filterData.minPrice || filterData.maxPrice) {
      filterMatch.price = {};
      if (filterData.minPrice) {
        filterMatch.price.$gte = parseFloat(filterData.minPrice);
      }
      if (filterData.maxPrice) {
        filterMatch.price.$lte = parseFloat(filterData.maxPrice);
      }
    }

    Object.entries(filterData).forEach(([field, value]) => {
      if (
        field !== 'category.name' &&
        field !== 'subCategories.name' &&
        field !== 'minPrice' &&
        field !== 'maxPrice'
      ) {
        // Skip category.name, subCategories.name,  minPrice, and maxPrice since they are already handled
        filterMatch[field] = value;
      }
    });
  }

  // aggregation pipeline
  const aggregateArray: PipelineStage[] = [
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $addFields: {
        user: {
          $cond: {
            if: { $eq: ['$user', []] },
            then: null,
            else: {
              $arrayElemAt: [
                {
                  $map: {
                    input: '$user',
                    as: 'usr',
                    in: {
                      _id: '$$usr._id',
                      name: '$$usr.name',
                      email: '$$usr.email',
                    },
                  },
                },
                0,
              ],
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'productId',
        as: 'reviews',
      },
    },
    {
      $addFields: {
        averageRating: {
          $cond: {
            if: { $gt: [{ $size: '$reviews' }, 0] },
            then: { $avg: '$reviews.rating' },
            else: 0,
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        metaTitle: 1,
        description: 1,
        price: 1,
        status: 1,
        discount: 1,
        quantity: 1,
        imageURLs: 1,
        isFeatured: 1,
        category: 1,
        subCategories: 1,
        brand: 1,
        colors: 1,
        sizes: 1,
        user: 1,
        createdAt: 1,
        averageRating: 1,
      },
    },
    {
      $sort: {
        [sortBy]: sortOrderTyped,
      },
    },
  ];

  // filtering of the products and add new pipeline
  if (
    (filterMatch && Object.keys(filterMatch).length) ||
    filterSearchMatch?.length
  ) {
    if (filterSearchMatch?.length) {
      aggregateArray.unshift({
        $match: { $or: filterSearchMatch },
      });
    } else if (filterMatch && Object.keys(filterMatch).length) {
      aggregateArray.unshift({
        $match: { $and: [filterMatch] },
      });
    }
  }

  // check limit
  if (limit != 0) {
    await aggregateArray.push({
      $skip: skip,
    });
    await aggregateArray.push({
      $limit: limit,
    });
  }

  // condition check
  const whereConditions = filterMatch
    ? { $and: [filterMatch] }
    : filterSearchMatch
    ? { $or: filterSearchMatch }
    : {};

  return {
    aggregateArray,
    whereConditions,
  };
};

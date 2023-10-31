import { SortOrder } from 'mongoose';

type OptionsType = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
};

type CalculationPaginationReturnType = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: SortOrder;
  skip: number;
};

export const calculationPagination = (
  options: OptionsType
): CalculationPaginationReturnType => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder || 'desc';

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    sortBy,
    skip,
    sortOrder,
  };
};

export const paginationHelper = {
  calculationPagination,
};

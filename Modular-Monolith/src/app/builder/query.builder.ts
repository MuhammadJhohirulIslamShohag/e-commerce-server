import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(model: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = model;
    this.query = query;
  }

  // search method
  search(searchFields: string[]) {
    const searchTerm = this?.query?.searchTerm as string | undefined;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchFields.map(
          field =>
            ({
              [field]: {
                $regex: searchTerm,
                $options: 'i',
              },
            } as FilterQuery<T>)
        ),
      }) as Query<T[], T>;
    }
    return this;
  }

  // filter method
  filter() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryObject: FilterQuery<any> = { ...this?.query };

    // Filtering
    const excludeFields = [
      'page',
      'limit',
      'sort',
      'fields',
      'searchTerm',
      'minPrice',
      'maxPrice',
      'populate',
    ];

    excludeFields.forEach(excludeField => delete queryObject[excludeField]);
    this.modelQuery = this.modelQuery.find(
      queryObject as FilterQuery<T>
    ) as Query<T[], T>;

    return this;
  }

  // populate method
  populate() {
    const populateFields = (this?.query?.populate as string)?.split(',');
    if (populateFields && populateFields?.length > 0) {
      populateFields.forEach(field => {
        this.modelQuery = this.modelQuery.populate(field) as Query<T[], T>;
      });
    }
    return this;
  }

  // sort method
  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sort as string) as Query<T[], T>;

    return this;
  }

  // paginate method
  paginate() {
    const page = Number(this?.query?.page || 1);
    const limit = Number(this?.query?.limit || 10);
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit) as Query<T[], T>;
    return this;
  }

  // fields method
  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields as string) as Query<T[], T>;

    return this;
  }

  // calculate total method
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page || 1);
    const limit = Number(this?.query?.limit || 10);
    const totalPages = Math.ceil(total / limit);

    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
      page,
      limit,
      next: nextPage,
      prev: prevPage,
      totalPage: totalPages,
      totalItems: total,
    };
  }
}

export default QueryBuilder;

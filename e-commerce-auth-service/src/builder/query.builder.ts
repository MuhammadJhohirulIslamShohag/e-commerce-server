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
    const searchTerm = this?.query?.searchTerm;
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
      });
    }
    return this;
  }

  // filter method
  filter() {
    const queryObject = { ...this?.query };

    // filtering
    const excludeFields = ['page', 'limit', 'sort', 'fields'];

    excludeFields.forEach(excludeField => delete queryObject[excludeField]);

    this.modelQuery = this.modelQuery.find(queryObject as FilterQuery<T>);

    return this;
  }

  // sort method
  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';

    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  // paginate method
  paginate() {
    const page = Number(this?.query?.page || 1);
    const limit = Number(this?.query?.limit || 10);
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // fields method
  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields as string);

    return this;
  }

  // calculate total method
  async countTotal() {
    const totalQuires = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQuires);
    const page = Number(this?.query?.page || 1);
    const limit = Number(this?.query?.limit || 10);

    return {
      page,
      limit,
      total,
    };
  }
}

export default QueryBuilder;

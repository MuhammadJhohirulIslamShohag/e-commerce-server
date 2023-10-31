import { SortOrder } from "mongoose";

export type PaginationOptionsType = {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: SortOrder
}
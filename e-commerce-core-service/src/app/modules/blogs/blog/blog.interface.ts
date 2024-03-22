import { Model } from 'mongoose';
import { IFile } from '../../../interfaces';

export type IBlog = {
  blogId: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  authorName: string;
  categoryId: string;
  imageUrl: string;
  tags: string[];
  views: number;
};

export type ICreateBlog = {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  authorName: string;
  tags: string[];
  imageFile: IFile;
};

// blog model type
export type BlogModel = Model<IBlog>;

// blog filterable filed
export type BlogFilters = {
  searchTerm?: string;
  isApproved?: boolean;
};

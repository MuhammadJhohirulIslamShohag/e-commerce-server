import { Model, Types } from 'mongoose';


// comment interface model type
export type IComment = {
  name: string;
  email: string;
  message: string;
  status?: boolean;
  blogId: Types.ObjectId
};

// comment model type
export type CommentModel = Model<IComment>;

// comment filterable filed
export type CommentFilters = {
  searchTerm?: string;
  status?: boolean;
};

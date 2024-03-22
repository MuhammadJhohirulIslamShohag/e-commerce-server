import httpStatus from 'http-status';
import axios from 'axios';

import QueryBuilder from '../../../builder/query.builder';
import ApiError from '../../../errors/ApiError';
import config from '../../../config';

import { commentSearchableFields } from './comment.constant';
import {  IComment } from './comment.interface';
import { Comment } from './comment.model';
import { Blog } from '../blog/blog.model';

class CommentServiceClass {
  #BlogModel;
  #CommentModel;
  #QueryBuilder: typeof QueryBuilder;
  constructor() {
    this.#BlogModel = Blog;
    this.#CommentModel = Comment;
    this.#QueryBuilder = QueryBuilder;
  }

  // create comment service
  readonly createComment = async (payload: IComment, userId: string) => {
    // getting user
    const user = await axios.get(
      `${config.user_url_auth_service_endpoint}/users/${userId}`
    );

    // check user is exit, if not exit return error
    if (!user?.data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');
    }
    const isExitBlog = await this.#BlogModel.findOne({
      blogId: payload.blogId,
    });
    // check blog is not exit
    if (!isExitBlog) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Blog Not Exit!');
    }

    const isExitComment = await this.#CommentModel.findOne({
      email: payload.email,
      blogId: payload.blogId,
    });

    // check comment is exit
    if (isExitComment) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Comment already Exit!');
    }

    // save comment
    const result = await this.#CommentModel.create(payload);

    if (!result || result === null) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Something went wrong while saving comment save, please try again with correct data!'
      );
    }

    // remove index
    this.#CommentModel.collection.dropIndexes();

    return result;
  };

  // get all comments service
  readonly allComments = async (query: Record<string, unknown>) => {
    const commentQuery = new this.#QueryBuilder(this.#BlogModel.find(), query)
      .search(commentSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields()
      .populate();

    // result of user
    const result = await commentQuery.modelQuery;

    // get meta user
    const meta = await commentQuery.countTotal();

    return {
      meta,
      result,
    };
  };

  // get single comment service
  readonly getSingleComment = async (payload: string) => {
    const result = await this.#CommentModel.findById(payload).exec();
    return result;
  };

  // update comment service
  readonly updateComment = async (id: string, payload: Partial<IComment>) => {
    // check already Comment exit, if not throw error
    const isExitComment = await this.#CommentModel.findById({ _id: id });
    if (!isExitComment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Comment Not Found!');
    }

    const { ...updatedCommentData }: Partial<IComment> = payload;

    // update the comment
    const result = await this.#CommentModel.findOneAndUpdate(
      { _id: id },
      { ...updatedCommentData },
      {
        new: true,
      }
    );

    return result;
  };

  // delete comment service
  readonly deleteComment = async (payload: string) => {
    // check already comment exit, if not throw error
    const isExitComment = await this.#CommentModel.findById({ _id: payload });
    if (!isExitComment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Comment Not Found!');
    }

    // delete the comment
    const result = await this.#CommentModel.findByIdAndDelete(payload);
    return result;
  };
}

export const CommentService = new CommentServiceClass();

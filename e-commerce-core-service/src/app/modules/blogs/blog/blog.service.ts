import httpStatus from 'http-status';
import mongoose from 'mongoose';
import axios from 'axios';

import QueryBuilder from '../../../builder/query.builder';
import ApiError from '../../../errors/ApiError';
import config from '../../../config';

import { Blog } from './blog.model';
import { blogSearchableFields } from './blog.constant';
import { IBlog, ICreateBlog } from './blog.interface';
import { IFile } from '../../../interfaces';
import { ImageUploadHelpers } from '../../../helpers/image-upload.helper';
import { Comment } from '../comment/comment.model';

class BlogServiceClass {
  #BlogModel;
  #CommentModel;
  #QueryBuilder: typeof QueryBuilder;
  constructor() {
    this.#BlogModel = Blog;
    this.#CommentModel = Comment;
    this.#QueryBuilder = QueryBuilder;
  }

  // create blog service
  readonly createBlog = async (payload: ICreateBlog, userId: string) => {
    // start transaction
    let result = null;
    const session = await mongoose.startSession();
    try {
      // start a session for the transaction
      await session.startTransaction();

      // getting user
      const user = await axios.get(
        `${config.user_url_auth_service_endpoint}/users/${userId}`
      );

      // check user is exit, if not exit return error
      if (!user?.data) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');
      }

      const isExitBlog = await this.#BlogModel.findOne({
        $or: [{ title: payload?.title }, { slug: payload?.slug }],
      });

      // check already blog exit, if not throw error
      if (isExitBlog) {
        throw new ApiError(httpStatus.CONFLICT, 'Blog Is Already Exit!');
      }

      // upload image to aws s3 bucket
      const blogImageURL = await ImageUploadHelpers.imageUploadToS3Bucket(
        'BLG',
        'blogImage',
        payload.imageFile.buffer
      );

      if (!blogImageURL) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Blog Image Upload Failed!');
      }

      // save data structure for blog
      const blogCreateObj = {
        title: payload.title,
        slug: payload.slug,
        description: payload.description,
        shortDescription: payload.shortDescription,
        authorName: payload.authorName,
        tags: payload.tags,
        categoryId: payload.categoryId,
        imageUrl: blogImageURL,
      };

      // save blog
      const blogResult = await this.#BlogModel.create([{ ...blogCreateObj }], {
        session,
      });

      if (!blogResult.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Blog create failed!');
      }

      // remove index
      this.#BlogModel.collection.dropIndexes();

      result = blogResult[0];
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
          "Can't create blog"
        );
      }
    }

    return result;
  };

  // get all blogs service
  readonly allBlogs = async (query: Record<string, unknown>) => {
    const blogQuery = new this.#QueryBuilder(this.#BlogModel.find(), query)
      .search(blogSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields()
      .populate();

    // result of user
    const result = await blogQuery.modelQuery;

    // get meta user
    const meta = await blogQuery.countTotal();

    return {
      meta,
      result,
    };
  };

  // get single blog service
  readonly getSingleBlog = async (payload: string) => {
    const result = await this.#BlogModel.findById(payload).exec();
    return result;
  };

  // update blog service
  readonly updateBlog = async (
    id: string,
    payload: Partial<IBlog>,
    blogImgFile: IFile | null
  ) => {
    // check already blog exit, if not throw error
    const isExitBlog = await this.#BlogModel.findOne({ _id: id });
    if (!isExitBlog) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Blog Not Found!');
    }

    const { ...updatedBlogData }: Partial<IBlog> = payload;

    // if blog image file, upload image to s3
    if (blogImgFile) {
      const blogImgURL =
        (await ImageUploadHelpers.imageUploadToS3BucketForUpdate(
          'BLG',
          'blogImage',
          blogImgFile.buffer,
          isExitBlog?.imageUrl.split('/')
        )) as string;

      updatedBlogData['imageUrl'] = blogImgURL;
    }

    // if tags, update tags
    if (payload?.tags && typeof payload?.tags === 'string') {
      updatedBlogData['tags'] = JSON.parse(payload?.tags);
    }

    // update the blog
    const result = await this.#BlogModel.findOneAndUpdate(
      { _id: id },
      { ...updatedBlogData },
      {
        new: true,
      }
    );

    return result;
  };

  // delete blog service
  readonly deleteBlog = async (payload: string) => {
    let result = null;
    // start transaction
    const session = await mongoose.startSession();
    try {
      // start a session for the transaction
      await session.startTransaction();

      // check already blog exit, if not throw error
      const isExitBlog = await this.#BlogModel.findOne({ _id: payload });
      if (!isExitBlog) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Blog Not Found!');
      }

      // delete the blog
      const blog = await this.#BlogModel.findOneAndDelete(
        { _id: payload },
        { session }
      );

      if (!blog) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Blog Removed Failed!');
      }

      // delete comment under blog
      const comment = await this.#CommentModel.deleteMany(
        { blogId: isExitBlog?.blogId },
        { session }
      );

      if (!comment) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Comments Removed Under Blog Failed!'
        );
      }

      result = blog;
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
          "Can't delete blog"
        );
      }
    }

    return result;
  };
}

export const BlogService = new BlogServiceClass();

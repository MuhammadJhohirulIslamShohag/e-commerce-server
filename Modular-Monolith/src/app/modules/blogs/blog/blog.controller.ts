import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

import catchAsync from '../../../shared/catchAsync';
import ApiError from '../../../errors/ApiError';
import responseReturn from '../../../shared/responseReturn';

import { BlogService } from './blog.service';
import { validateRequireFields } from '../../../shared/validateRequireFields';
import { ImageUploadHelpers } from '../../../helpers/image-upload.helper';
import { TFileRequestBody } from '../../../interfaces/common';

class BlogControllerClass {
  #BlogService: typeof BlogService;

  constructor(service: typeof BlogService) {
    this.#BlogService = service;
  }

  // create blog controller
  readonly createBlog = catchAsync(async (req: Request, res: Response) => {
    const {
      title,
      slug,
      description,
      shortDescription,
      authorName,
      categoryId,
    } = req.body;

    // validate value
    validateRequireFields({
      title,
      slug,
      description,
      authorName,
      categoryId,
    });

    // validate tags data
    if (JSON.parse(req.body?.tags)?.length < 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tag is required!');
    }

    // blog image file validation
    const blogImageFile = await ImageUploadHelpers.imageFileValidate(
      req.files as unknown as TFileRequestBody,
      'blogImage',
      'blog'
    );

    // data structure for blog
    const blogCreateObj = {
      title,
      slug,
      description,
      shortDescription: shortDescription || '',
      authorName,
      tags: JSON.parse(req.body?.tags),
      imageFile: blogImageFile,
      categoryId,
    };

    const result = await this.#BlogService.createBlog(
      blogCreateObj,
      (req.user as JwtPayload).userId as string
    );

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blog Created Successfully!',
      data: result,
    });
  });

  // get all blogs controller
  readonly allBlogs = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#BlogService.allBlogs(req.query);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Blogs Retrieved Successfully!',
      data: result.result,
      meta: result.meta,
    });
  });

  // get single blog user controller
  readonly getSingleBlog = catchAsync(async (req: Request, res: Response) => {
    const brandId = req.params.id;

    const result = await this.#BlogService.getSingleBlog(brandId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Blog Retrieved Successfully!',
      data: result,
    });
  });

  // update blog controller
  readonly updateBlog = catchAsync(async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const { ...updateBlogData } = req.body;

    // check validity request payload body
    await validateRequireFields(updateBlogData);

    // blog image file
    const blogImageFile = await ImageUploadHelpers.imageFileValidateForUpdate(
      req.files as unknown as TFileRequestBody,
      'blogImage',
      'blog'
    );

    const result = await this.#BlogService.updateBlog(
      blogId,
      updateBlogData,
      blogImageFile
    );

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blog Updated Successfully!',
      data: result,
    });
  });

  // delete blog controller
  readonly deleteBlog = catchAsync(async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const result = await this.#BlogService.deleteBlog(blogId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blog Removed Successfully!',
      data: result,
    });
  });
}

export const BlogController = new BlogControllerClass(BlogService);

import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

import { BlogService } from './blog.service';

class BlogControllerClass {
  #BlogService: typeof BlogService;

  constructor(service: typeof BlogService) {
    this.#BlogService = service;
  }

  // create blog controller
  readonly createBlog = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#BlogService.createBlog(
        req
      );

      responseReturn(res, result);
    }
  );

  // get all blogs controller
  readonly allBlogs = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#BlogService.allBlogs(
        req
      );

      responseReturn(res, result);
    }
  );

  // get single blog user controller
  readonly getSingleBlog = catchAsync(
    async (req: Request, res: Response) => {
      const result =
        await this.#BlogService.getSingleBlog(req);

      responseReturn(res, result);
    }
  );

  // update blog controller
  readonly updateBlog = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#BlogService.updateBlog(
        req
      );

      responseReturn(res, result);
    }
  );

  // delete blog controller
  readonly deleteBlog = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#BlogService.deleteBlog(
        req
      );

      responseReturn(res, result);
    }
  );
}

export const BlogController = new BlogControllerClass(
  BlogService
);

import { Request } from 'express';
import { CoreService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

class BlogServiceClass {
  #CoreService;
  constructor() {
    this.#CoreService = CoreService;
  }

  // create blog service
  readonly createBlog = async (req: Request) => {
    const response: IGenericResponse = await this.#CoreService.post(
      `blogs`,
      {...req.body, files: req.files},
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get all blogs service
  readonly allBlogs = async (req: Request) => {
    const response: IGenericResponse = await CoreService.get(
      `blogs`,
      {
        params: req.query,
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get single blog service
  readonly getSingleBlog = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.get(
      `blogs/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // update blog service
  readonly updateBlog = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.patch(
      `blogs/${id}`,
      {...req.body, files: req.files},
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // delete blog service
  readonly deleteBlog = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.delete(
      `blogs/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };
}

export const BlogService = new BlogServiceClass();

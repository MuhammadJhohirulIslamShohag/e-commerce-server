import multer from 'multer';
import { Router } from 'express';

import auth from '../../middlewares/auth';

import { BlogController } from './blog.controller';
import { ENUM_USER_ROLE } from '../../../enum/user';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

class BlogRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and get all blogs routes
    this.routers
      .route('/')
      .post(
        auth(ENUM_USER_ROLE.ADMIN),
        upload.fields([{ name: 'blogImage', maxCount: 1 }]),
        BlogController.createBlog
      )
      .get(BlogController.allBlogs);

    // update and get single blog, delete routes
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN),
        upload.fields([{ name: 'blogImage', maxCount: 1 }]),
        BlogController.updateBlog
      )
      .get(BlogController.getSingleBlog)
      .delete(
        auth(ENUM_USER_ROLE.ADMIN),
        BlogController.deleteBlog
      );
  }
}

const allRoutes = new BlogRouterClass().routers;

export { allRoutes as BlogRoutes };

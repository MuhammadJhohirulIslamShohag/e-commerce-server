import { Router } from 'express';
import multer, { memoryStorage } from 'multer';
import { BlogController } from './blog.controller';

const storage = memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 31457280 } });

class BrandRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and get all categories routes
    this.routers
      .route('/')
      .post(
        upload.single("blogImage"),
        BlogController.createBlog
      )
      .get(BlogController.allBlogs);

    // update and get single Blog, delete routes
    this.routers
      .route('/:id')
      .patch(
        upload.single("blogImage"),
        BlogController.updateBlog
      )
      .get(BlogController.getSingleBlog)
      .delete(BlogController.deleteBlog);
  }
}

const allRoutes = new BrandRouterClass().routers;

export { allRoutes as BlogRoutes };

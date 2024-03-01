import { Router } from 'express';
import multer from 'multer';

import auth from '../../middlewares/auth';

import { ProductController } from './product.controller';
import { ENUM_USER_ROLE } from '../../../enum/user';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

class ProductRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // get all products by category routes
    this.routers.get(
      '/categories/:categoryId',
      ProductController.getProductsByCategory
    );

    // get all products by sub category routes
    this.routers.get(
      '/sub-categories/:subCategoryId',
      ProductController.getProductsBySubCategory
    );

    // create and get all products routes
    this.routers
      .route('/')
      .post(
        auth(ENUM_USER_ROLE.ADMIN),
        upload.fields([{ name: 'productImage', maxCount: 10 }]),
        ProductController.createProduct
      )
      .get(ProductController.allProducts);

    // update and get single products, delete routes
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN),
        upload.fields([{ name: 'productImage', maxCount: 10 }]),
        ProductController.updateProduct
      )
      .get(ProductController.getSingleProduct)
      .delete(auth(ENUM_USER_ROLE.ADMIN), ProductController.deleteProduct);
  }
}

const allRoutes = new ProductRouterClass().routers;

export { allRoutes as ProductRoutes };

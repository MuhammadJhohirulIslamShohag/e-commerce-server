import { Router } from 'express';
import multer from 'multer';

import { ProductController } from './product.controller';

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
        upload.fields([{ name: 'productImage', maxCount: 10 }]),
        ProductController.createProduct
      )
      .get(ProductController.allProducts);

    // update and get single products, delete routes
    this.routers
      .route('/:id')
      .patch(
        upload.fields([{ name: 'productImage', maxCount: 10 }]),
        ProductController.updateProduct
      )
      .get(ProductController.getSingleProduct)
      .delete(ProductController.deleteProduct);
  }
}

const allRoutes = new ProductRouterClass().routers;

export { allRoutes as ProductRoutes };

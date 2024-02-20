import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { ProductValidation } from './product.validation'
import { ProductController } from './product.controller'
import { USER_ROLE_ENUM } from '../../../enum/user'
import { auth } from '../../middleware/auth'

const router = express.Router()

// get all products by category routes
router.get('/category/:categoryId', ProductController.getProductsByCategory)

// get all products by sub category routes
router.get(
  '/sub-category/:subCategoryId',
  ProductController.getProductsBySubCategory
)

router.get('/title/:title', ProductController.getSingleProductByTitle)

// create and get all products routes
router
  .route('/')
  .post(
    auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPERADMIN),
    validateRequest(ProductValidation.productCreateZodSchema),
    ProductController.createProduct
  )
  .get(ProductController.allProducts)

// update and get single products, delete routes
router
  .route('/:id')
  .patch(
    auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPERADMIN),
    validateRequest(ProductValidation.productUpdateZodSchema),
    ProductController.updateProduct
  )
  .get(ProductController.getSingleProduct)
  .delete(
    auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPERADMIN),
    ProductController.deleteProduct
  )

// add question, review to product routes
router
  .post(
    '/:id/create-review',
    auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPERADMIN, USER_ROLE_ENUM.USER),
    validateRequest(ProductValidation.addReviewToProductZodSchema),
    ProductController.addReviewToProduct
  )
  .post(
    '/:id/create-question',
    auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPERADMIN, USER_ROLE_ENUM.USER),
    validateRequest(ProductValidation.addQuestionToProductZodSchema),
    ProductController.addQuestionToProduct
  )

export const ProductRoutes = router

import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { paginationOptionFields } from '../../../constants/pagination'
import ApiError from '../../../errors/ApiError'
import { IGenericResponse } from '../../../interfaces/common'
import catchAsync from '../../../shared/catchAsync'
import { pick } from '../../../shared/pick'
import responseReturn from '../../../shared/responseReturn'
import { productFilterableFields } from './product.constant'
import { IProduct } from './product.interface'
import { ProductService } from './product.service'

// create product controller
const createProduct = catchAsync(async (req: Request, res: Response) => {
  const { ...productData } = req.body
  const result = await ProductService.createProduct(productData)

  // if not created product, throw error
  if (!result) {
    throw new ApiError(httpStatus.CONFLICT, `Product Create Failed!`)
  }

  responseReturn<IProduct | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Created Successfully!',
    data: result,
  })
})

// get all product controller
const allProducts = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationOptionFields)
  const filters = pick(req.query, productFilterableFields)

  const result = await ProductService.allProducts(paginationOptions, filters)

  responseReturn<IGenericResponse<IProduct[]>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Products Retrieved Successfully!',
    data: result,
  })
})

// get single product  controller
const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id
  const result = await ProductService.getSingleProduct(productId)

  responseReturn<IProduct | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Product Retrieved Successfully!',
    data: result,
  })
})
const getSingleProductByTitle = catchAsync(async (req: Request, res: Response) => {
  const title = req.params.title
  const result = await ProductService.getSingleProductBytitle(title)

  responseReturn<IProduct | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Product Retrieved Successfully!',
    data: result,
  })
})

// update product controller
const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id
  const { ...updateProductData } = req.body
  const result = await ProductService.updateProduct(
    productId,
    updateProductData
  )

  responseReturn(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Updated Successfully!',
    data: result,
  })
})

// delete product controller
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id
  const result = await ProductService.deleteProduct(productId)

  responseReturn<IProduct | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Removed Successfully!',
    data: result,
  })
})

// add review to to product controller
const addReviewToProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id
  const { ...addReviewData } = req.body
  const result = await ProductService.addReviewToProduct(
    productId,
    addReviewData
  )

  responseReturn<IProduct | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Add Review To Product Successfully!',
    data: result,
  })
})

// add question to product controller
const addQuestionToProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id
  const { ...addQuestionData } = req.body
  const result = await ProductService.addQuestionToProduct(
    productId,
    addQuestionData
  )

  responseReturn<IProduct | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Add Question To Product Successfully!',
    data: result,
  })
})

// add question to product controller
const addSubCategoryToProduct = catchAsync(
  async (req: Request, res: Response) => {
    const productId = req.params.id
    const { ...addQuestionData } = req.body
    const result = await ProductService.addSubCategoryToProduct(
      productId,
      addQuestionData
    )

    responseReturn<IProduct | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Add Question To Product Successfully!',
      data: result,
    })
  }
)

// get products by category controller
const getProductsByCategory = catchAsync(
  async (req: Request, res: Response) => {
    const categoryId = req.params.categoryId
    const paginationOptions = pick(req.query, paginationOptionFields)

    const result = await ProductService.getProductsByCategory(
      paginationOptions,
      categoryId
    )

    responseReturn<IGenericResponse<IProduct[]>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get Products By Category Successfully!',
      data: result,
    })
  }
)

// get products by sub category controller
const getProductsBySubCategory = catchAsync(
  async (req: Request, res: Response) => {
    const subCategoryId = req.params.subCategoryId
    const paginationOptions = pick(req.query, paginationOptionFields)

    const result = await ProductService.getProductsBySubCategory(
      paginationOptions,
      subCategoryId
    )

    responseReturn<IGenericResponse<IProduct[]>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get Products By Sub Category Successfully!',
      data: result,
    })
  }
)

export const ProductController = {
  createProduct,
  addQuestionToProduct,
  addSubCategoryToProduct,
  addReviewToProduct,
  allProducts,
  updateProduct,
  getSingleProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsBySubCategory,
  getSingleProductByTitle
}

const SSLCommerzPayment = require('sslcommerz-lts')
import httpStatus from 'http-status'
import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

import catchAsync from '../../../shared/catchAsync'
import config from '../../../config'
import User from '../user/user.model'
import ApiError from '../../../errors/ApiError'
import { OrderService } from '../order/order.service'
import Order from '../order/order.model'
import Coupon from '../coupon/coupon.model'
import Product from '../product/product.model'
import responseReturn from '../../../shared/responseReturn'

const paymentInit = catchAsync(async (req: Request, res: Response) => {
  // order information
  const { ...orderData } = req.body

  // check order data has or not
  if (Object.keys(orderData)?.length < 1) {
    throw new ApiError(httpStatus.CONFLICT, 'Invalid Order!')
  }

  const { products, ...others } = orderData

  // make transactionId
  const transactionId = uuidv4()
  // get user info
  const user = await User.findById({ _id: orderData?.customer?.customerId })

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found User!')
  }

  // get all of order product ids
  const productPriceModify = products?.map((product: any) => product?.productId)

  if (productPriceModify?.length < 1) {
    throw new ApiError(httpStatus.CONFLICT, 'Invalid Product Ids!')
  }

  // get all of order products based of specific product id
  const allProducts = await Product.find({
    _id: {
      $in: productPriceModify,
    },
  })

  // check order product has or not
  if (allProducts?.length < 1) {
    throw new ApiError(httpStatus.CONFLICT, 'Invalid Products!')
  }

  // get product quantity based of specific id
  const productQuantity: any = (productId: string) => {
    const objectId = new Types.ObjectId(productId)
    return products?.find((product: any) =>
      new Types.ObjectId(product?.productId).equals(objectId)
    )?.quantity
  }

  // get product price calculation with discount
  const productPriceWithDiscount: any = (
    price: number,
    discount: number
  ): number => {
    const discountAmount = Math.ceil((discount / 100) * price)
    return price - discountAmount
  }

  // calculate order price and added quantity
  const productPriceModifies = allProducts?.map((product: any) => ({
    productId: product?._id,
    quantity: productQuantity(product?._id),
    price:
      productPriceWithDiscount(product?.price, product?.discount) *
      productQuantity(product?._id),
    originalPrice: product?.price,
    discount: product?.discount,
  }))

  // total net amount with discount
  let totalNetAmount = productPriceModifies?.reduce(
    (acc: number, cur: { price: number }) => {
      if (cur?.price > 0) {
        acc += cur?.price
      }
      return acc
    },
    0
  )

  // check order has coupon
  if (others?.coupon) {
    // check already coupon exit, if not, throw error
    const isExitCoupon = await Coupon.findOne({ code: others?.coupon })

    // check already coupon exit, throw error
    if (!isExitCoupon) {
      throw new ApiError(httpStatus.CONFLICT, 'Coupon Not Exit!')
    }

    const couponDiscountAmount = Math.ceil(
      (isExitCoupon?.discount / 100) * totalNetAmount
    )

    totalNetAmount = totalNetAmount - couponDiscountAmount
  }

  // if delivery charge has, add delivery charge to totalNetAmount
  if (others?.deliveryCharge) {
    totalNetAmount = totalNetAmount + Math.ceil(others?.deliveryCharge)
  }

  // sslcommerz init
  const data = {
    total_amount: totalNetAmount,
    currency: 'BDT',
    tran_id: transactionId, // use unique tran_id for each api call
    success_url: `${config.serverUrl}/api/v1/payment/success`,
    fail_url: `${config.serverUrl}/api/v1/payment/fail`,
    cancel_url: `${config.serverUrl}/api/v1/payment/cancel`,
    ipn_url: `${config.serverUrl}/api/v1/payment/ipn`,
    shipping_method: 'Courier',
    product_name: 'Computer.',
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: user?.name,
    cus_email: others?.email || user?.email,
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    cus_fax: '01711111111',
    ship_name: 'Customer Name',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  }

  const store_id = config.ssl_store_id
  const store_password = config.ssl_store_password
  const isLive = false

  if (store_id && store_password) {
    const sslCommerz = new SSLCommerzPayment(store_id, store_password, isLive) //true for live default false for sandbox
    const apiResponse = await sslCommerz.init(data)
    const URL = apiResponse.GatewayPageURL

    // create order to database
    const result = await OrderService.createOrder(
      orderData?.customer?.customerId,
      productPriceModifies,
      others,
      totalNetAmount,
      transactionId
    )
    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order Create Failed!')
    }

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment Init successfully!',
      data: URL,
    })
  }
})

const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const transactionId = req.body
  if (!transactionId?.tran_id) {
    // redirect to client
    return res.redirect(`${config.clientUrl}/account/order`)
  }
  const data = {
    transactionId: transactionId?.tran_id,
    payment_status: 'succeeded',
  }
  // const result = await updateDonateService(data.transactionId);
  const result = await Order.updateOne(
    { transactionId: data.transactionId },
    {
      $set: {
        payment_status: data.payment_status,
      },
    }
  )

  if (result?.modifiedCount > 0) {
    // redirect to client
    if (config.env === 'production') {
      res.redirect(`${config.clientProductionUrl}/account/order`)
    } else {
      res.redirect(`${config.clientUrl}/account/order`)
    }
  }
})

const paymentFail = catchAsync(async (req: Request, res: Response) => {
  const transactionId = req.body
  if (!transactionId?.tran_id) {
    // redirect to client
    if (config.env === 'production') {
      return res.redirect(
        `${config.clientProductionUrl}/checkout/onepagecheckout`
      )
    } else {
      return res.redirect(`${config.clientUrl}/checkout/onepagecheckout`)
    }
  }
  const result = await Order.deleteOne({
    transactionId: transactionId?.tran_id,
  })
  if (result?.deletedCount > 0) {
    if (config.env === 'production') {
      res.redirect(`${config.clientProductionUrl}/checkout/onepagecheckout`)
    } else {
      res.redirect(`${config.clientUrl}/checkout/onepagecheckout`)
    }
  }
})

const paymentCancel = catchAsync(async (req: Request, res: Response) => {
  const transactionId = req.body
  if (!transactionId?.tran_id) {
    // redirect to client
    if (config.env === 'production') {
      return res.redirect(
        `${config.clientProductionUrl}/checkout/onepagecheckout`
      )
    } else {
      return res.redirect(`${config.clientUrl}/checkout/onepagecheckout`)
    }
  }
  const result = await Order.deleteOne({
    transactionId: transactionId?.tran_id,
  })
  if (result?.deletedCount > 0) {
    if (config.env === 'production') {
      res.redirect(`${config.clientProductionUrl}/checkout/onepagecheckout`)
    } else {
      res.redirect(`${config.clientUrl}/checkout/onepagecheckout`)
    }
  }
})

export const PaymentController = {
  paymentInit,
  paymentSuccess,
  paymentFail,
  paymentCancel,
}

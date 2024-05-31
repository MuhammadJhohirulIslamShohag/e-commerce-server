import Product from '../product/product.model';
import Order from '../order/order.model';
import User from '../user/user.model';

class DashboardServiceClass {
  #ProductModel;
  #OrderModel;
  #UserModel;

  constructor() {
    this.#ProductModel = Product;
    this.#OrderModel = Order;
    this.#UserModel = User;
  }

  // get dash widget info service
  readonly dashWidgetInfo = async () => {
    // get total products and products;
    const products = await this.#ProductModel.find().limit(5);
    const productTotal = await this.#ProductModel.countDocuments({});

    // get total orders and orders;
    const orders = await this.#OrderModel
      .find({})
      .populate('orderedBy')
      .limit(5);
    const orderTotal = await this.#OrderModel.countDocuments({});

    // get total users and users;
    const users = await this.#UserModel.find({}).limit(3);
    const userTotal = await this.#UserModel.countDocuments({});

    // get total users and users;
    const totalEarnings = await this.#OrderModel.aggregate([
      {
        $unwind: {
          path: '$paymentIntents',
        },
      },
      {
        $group: {
          _id: null,
          totalEarning: {
            $sum: '$paymentIntents.amount',
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalEarning: 1,
        },
      },
    ]);

    return {
      products: {
        total: productTotal,
        products,
      },
      orders: {
        total: orderTotal,
        orders,
        totalEarnings: totalEarnings?.[0]?.totalEarning,
      },
      users: {
        total: userTotal,
        users,
      },
    };
  };
}

export const DashboardService = new DashboardServiceClass();

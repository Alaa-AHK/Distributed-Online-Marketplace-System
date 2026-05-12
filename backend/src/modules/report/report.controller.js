import { transactionModel } from '../../../db/models/transaction.model.js';
import { orderModel } from '../../../db/models/order.model.js';
import { userModel } from '../../../db/models/user.model.js';
import { productModel } from '../../../db/models/product.model.js';

const summaryReport = async (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {

    const [totalTransactions, revenueResult, allOrders, allUsers] =
      await Promise.all([

        transactionModel.countDocuments(),

        transactionModel.aggregate([
          { $group: { _id: null, total: { $sum: "$price" } } }
        ]),

        orderModel.find(),

        userModel.find({}, "-password")
      ]);

    // =========================
    // FIX: MANUAL POPULATION
    // =========================
    const transactions = await transactionModel.find();

    const populatedTransactions = await Promise.all(
      transactions.map(async (t) => {

        const product = await productModel.findById(t.product);
        const buyer = await userModel.findById(t.buyer).select("-password");
        const seller = await userModel.findById(t.seller).select("-password");

        return {
          ...t._doc,
          product,
          buyer,
          seller
        };
      })
    );

    // =========================
    // FIX ORDERS ITEMS
    // =========================
    const populatedOrders = await Promise.all(
      allOrders.map(async (order) => {

        const items = await Promise.all(
          order.items.map(async (item) => {

            const product = await productModel.findById(item.productId);

            return {
              ...item._doc,
              productId: product
            };
          })
        );

        return {
          ...order._doc,
          items
        };
      })
    );

    res.json({
      totalTransactions,
      totalRevenue: revenueResult[0]?.total || 0,
      orders: populatedOrders,
      transactions: populatedTransactions,
      users: allUsers
    });

  } catch (err) {

    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// ADD THIS NEW FUNCTION (public, no auth required)
const publicSummaryReport = async (req, res) => {
  try {
    const totalTransactions = await transactionModel.countDocuments();

    const revenueResult = await transactionModel.aggregate([
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    res.json({
      totalTransactions,
      totalRevenue: revenueResult[0]?.total || 0,
      generatedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { summaryReport, publicSummaryReport };

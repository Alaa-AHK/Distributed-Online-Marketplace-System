import { transactionModel } from '../../../db/models/transaction.model.js';

const summaryReport = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.json({ message: "Access denied" });
  }

  const totalTransactions = await transactionModel.countDocuments();

  const totalRevenue = await transactionModel.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$price" }
      }
    }
  ]);

  res.json({
    totalTransactions,
    totalRevenue: totalRevenue[0]?.total || 0
  });
};
export{
    summaryReport,
}
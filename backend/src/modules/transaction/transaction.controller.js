import { productModel } from "../../../db/models/product.model.js";
import { userModel } from "../../../db/models/user.model.js";
import { transactionModel } from "../../../db/models/transaction.model.js";
import { walletModel } from "../../../db/models/wallet.model.js";
import { inventoryModel } from "../../../db/models/inventory.model.js";


const getAllTransactions = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const transactions = await transactionModel
      .find()
      .populate("product")
      .populate("buyer", "-password")
      .populate("seller", "-password");

    res.json({ transactions });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



export {
  getAllTransactions
};
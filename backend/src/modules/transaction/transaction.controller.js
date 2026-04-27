import { productModel } from "../../../db/models/product.model.js";
import { userModel } from "../../../db/models/user.model.js";
import { transactionModel } from "../../../db/models/transaction.model.js";

const purchase = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body; // 🔥 مهم جدًا

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.status !== "available") {
      return res.status(400).json({ message: "Product already sold" });
    }

    const buyer = await userModel.findById(userId);
    const seller = await userModel.findById(product.owner);

    if (buyer.balance < product.price) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    buyer.balance -= product.price;
    seller.balance += product.price;

    product.owner = buyer._id;
    product.status = "sold";

    await buyer.save();
    await seller.save();
    await product.save();

    const transaction = await transactionModel.create({
      buyer: buyer._id,
      seller: seller._id,
      product: product._id,
      price: product.price
    });

    res.json({ message: "Purchase successful", transaction });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
const getMyTransactions = async (req, res) => {
  const transactions = await transactionModel.find({
    $or: [
      { buyer: req.user._id },
      { seller: req.user._id }
    ]
  }).populate("product");

  res.json({ transactions });
};
const getAllTransactions = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const transactions = await transactionModel
      .find()
      .populate("buyer seller product");

    res.json({ transactions });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



export { purchase ,getMyTransactions,getAllTransactions};
import { walletModel } from "../../../db/models/wallet.model.js";
import { userModel } from "../../../db/models/user.model.js";

const deposit = async (req, res) => {
  try {
    const { amount } = req.body;

    // 1. validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // 2. check auth user
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized - no user found" });
    }

    const userId = req.user._id;

    // 3. update wallet
    const wallet = await walletModel.findOneAndUpdate(
      { userId },
      { $inc: { balance: Number(amount) } },
      { new: true, upsert: true }
    );

    // 4. update user balance (IMPORTANT)
    const user = await userModel.findByIdAndUpdate(
      userId,
      { $inc: { balance: Number(amount) } },
      { new: true }
    );

    return res.status(200).json({
      message: "Deposit successful",
      wallet,
      user
    });

  } catch (error) {
    console.error("Deposit Error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getWallet = async (req, res) => {
  const wallet = await walletModel.findOne({ userId: req.user._id });
  res.json({ wallet });
};

export { deposit, getWallet };
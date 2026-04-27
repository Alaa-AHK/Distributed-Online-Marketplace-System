import { Router } from "express";
import { purchase, getMyTransactions, getAllTransactions } from "./transaction.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const TransactionRoutes = Router();


TransactionRoutes.post("/purchase", authMiddleware, purchase);

TransactionRoutes.get("/my-transactions", authMiddleware, getMyTransactions);

TransactionRoutes.get("/", authMiddleware, getAllTransactions);

export default TransactionRoutes;
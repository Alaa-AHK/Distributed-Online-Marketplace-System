import express, { Router } from "express";
import {   getAllTransactions } from "./transaction.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const TransactionRoutes = Router();
TransactionRoutes.use(express.json());

TransactionRoutes.get("/", authMiddleware, getAllTransactions);

export default TransactionRoutes;
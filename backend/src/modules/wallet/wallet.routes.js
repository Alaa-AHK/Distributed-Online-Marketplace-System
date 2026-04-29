import express,{ Router } from "express"
import { deposit, getWallet } from "./wallet.controller.js";
import { authMiddleware } from './../../middleware/authMiddleware.js';


export const walletRoutes= Router();
walletRoutes.use(express.json());

walletRoutes.post("/deposit", authMiddleware , deposit);
walletRoutes.get("/mywallet", authMiddleware , getWallet);


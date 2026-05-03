import express from "express";
import { getMessages } from "./chat.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

export const ChatRoutes = express.Router();

ChatRoutes.get("/messages",authMiddleware, getMessages);


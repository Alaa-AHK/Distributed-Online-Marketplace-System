import express from "express";
import { getMessages } from "./chat.controller.js";

export const ChatRoutes = express.Router();

ChatRoutes.get("/messages", getMessages);


import express, { Router } from "express";
import { askAi, getServices } from "./ai.controller.js";

export const AiRoutes = Router();
AiRoutes.use(express.json());

AiRoutes.get("/public/services", getServices);
AiRoutes.post("/ai/ask", askAi);

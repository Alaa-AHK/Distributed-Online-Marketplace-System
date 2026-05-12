import express,{ Router } from "express";
import{authMiddleware}from "../../middleware/authMiddleware.js";
import { summaryReport } from "./report.controller.js";

export const ReportRoutes = Router();
ReportRoutes.use(express.json());

ReportRoutes.get("/report/summary",authMiddleware , summaryReport);

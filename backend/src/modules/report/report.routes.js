import express,{ Router } from "express";
import{authMiddleware}from "../../middleware/authMiddleware.js";
import { summaryReport, publicSummaryReport } from "./report.controller.js";

export const ReportRoutes = Router();
ReportRoutes.use(express.json());


ReportRoutes.get("/report/public-summary", publicSummaryReport);

ReportRoutes.get("/report/summary",authMiddleware , summaryReport);

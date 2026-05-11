import express, { Router } from "express";
import multer from "multer";

import { authMiddleware } from "../../middleware/authMiddleware.js";
import {getProduct,postProduct,updateProduct,deleteProduct,addRating,getSingleProduct,searchProducts ,buyProduct,getMyProducts} from "../../modules/product/product.controller.js";

export const ProductRoutes = Router();

ProductRoutes.use(express.json());

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/utilities/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

ProductRoutes.get('/products/search', searchProducts);

// Get all products
ProductRoutes.get('/products', getProduct);

// Get single product
ProductRoutes.get('/product/:id', getSingleProduct);

// Create product
ProductRoutes.post('/product', authMiddleware, upload.single('image'), postProduct);

// Update product
ProductRoutes.patch(
  '/product/:id',
  authMiddleware,
  upload.single('image'),   
  updateProduct
);
ProductRoutes.get("/my-products",authMiddleware,getMyProducts);

// Delete product
ProductRoutes.delete('/product/:id', authMiddleware, deleteProduct);

// Rate product
ProductRoutes.post('/product/:productId/rate', authMiddleware, addRating);
ProductRoutes.post("/buy/:productId", authMiddleware, buyProduct);
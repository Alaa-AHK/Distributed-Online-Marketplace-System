import { productModel } from "../../../db/models/product.model.js";
import { inventoryModel } from "../../../db/models/inventory.model.js";

const getProduct = async (req, res) => {
  try {

    // ✅ هات المنتجات بدون populate الأول (أكثر أمان)
    const products = await productModel.find();

    const result = await Promise.all(
      products.map(async (product) => {

        let stock = 0;

        try {
          const inventory = await inventoryModel.findOne({
            productId: product._id
          });

          stock = inventory ? inventory.quantity : 0;
        } catch (invError) {
          console.log("Inventory error:", invError.message);
        }

        return {
          _id: product._id,
          title: product.title,
          description: product.description,
          price: product.price,
          image: product.image,
          owner: product.owner,
          stock
        };
      })
    );

    return res.status(200).json({
      message: "Products fetched successfully",
      products: result
    });

  } catch (error) {

    console.log("GET PRODUCTS FAILED:", error);

    return res.status(500).json({
      message: "Server error in getProducts",
      error: error.message
    });
  }
};




const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;

    const products = await productModel.find({
      title: { $regex: keyword, $options: "i" }
    });

    res.json({ products });

  } catch (error) {
    res.status(500).json({ message: "Search error", error });
  }
};


const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ fetch product safely
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ safe inventory handling
    let stock = 0;

    try {
      const inventory = await inventoryModel.findOne({
        productId: id
      });

      stock = inventory ? inventory.quantity : 0;
    } catch (invError) {
      console.log("Inventory error:", invError.message);
    }

    // ✅ response cleaned for frontend
    return res.status(200).json({
      message: "Product fetched successfully",
      product: {
        _id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
        owner: product.owner,
        status: product.status,
        stock
      }
    });

  } catch (error) {

    console.log("GET SINGLE PRODUCT ERROR:", error);

    return res.status(500).json({
      message: "Error fetching product",
      error: error.message
    });
  }
};


const postProduct = async (req, res) => {
  try {
    const { title, price, quantity } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title and price are required" });
    }

    const addedProduct = await productModel.create({
      ...req.body,
      owner: req.user._id
    });


    await inventoryModel.create({
      productId: addedProduct._id,
      quantity: quantity || 0
    });

    res.status(201).json({
      message: "Product added successfully",
      addedProduct
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔒 owner check
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your product" });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (req.body.quantity !== undefined) {
      await inventoryModel.findOneAndUpdate(
        { productId: id },
        { quantity: req.body.quantity }
      );
    }

    res.json({ message: "Updated successfully", updatedProduct });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your product" });
    }

    await productModel.findByIdAndDelete(id);

    await inventoryModel.findOneAndDelete({ productId: id });

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



const addRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyRated = product.ratings.find(
      (r) => r.userId.toString() === userId.toString()
    );

    if (alreadyRated) {
      return res.json({ message: "You already rated this product" });
    }

    product.ratings.push({ userId, rating, comment });
    await product.save();

    res.json({ message: "Rating added successfully", product });

  } catch (error) {
    res.status(500).json({ message: "Error adding rating", error });
  }
};



export {
  getProduct,
  searchProducts,
  getSingleProduct,
  postProduct,
  updateProduct,
  deleteProduct,
  addRating
};
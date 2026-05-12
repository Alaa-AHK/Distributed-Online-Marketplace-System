import { productModel } from "../../../db/models/product.model.js";
import { transactionModel } from "../../../db/models/transaction.model.js";
import { servicesData } from "./services.data.js";

const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_MODEL_ID = process.env.HF_MODEL_ID || "meta-llama/Meta-Llama-3-8B-Instruct:fastest";

const formatCurrency = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "?";
  }
  return `$${Number(value).toFixed(2)}`;
};

const buildContext = ({ products, report, services }) => {
  const servicesText = services.map((service, index) => `${index + 1}. ${service}`).join("\n");
  const productsText = products
    .slice(0, 8)
    .map((product) => {
      const price = formatCurrency(product.price);
      const stock = product.quantity ?? "?";
      const brand = product.brand || "?";
      return `- ${product.title} | Brand: ${brand} | Price: ${price} | Stock: ${stock}`;
    })
    .join("\n");

  return [
    "SERVICES:\n" + servicesText,
    "PRODUCTS (max 8):\n" + (productsText || "No products available."),
    `REPORT:\nTotal transactions: ${report.totalTransactions}\nTotal revenue: $${report.totalRevenue}`
  ].join("\n\n");
};

const formatProductListAnswer = (products) => {
  if (!products.length) {
    return "No products are available right now.";
  }

  const lines = products.slice(0, 8).map((product) => {
    const price = formatCurrency(product.price);
    const stock = product.quantity ?? "?";
    return `- ${product.title} (${price}, ${stock} in stock)`;
  });

  return `Here are the available products:\n${lines.join("\n")}`;
};

const formatCheapestProductAnswer = (products) => {
  if (!products.length) {
    return "No products are available right now.";
  }

  const cheapest = products.reduce((min, product) => {
    if (min === null) return product;
    if (product.price === undefined || product.price === null) return min;
    if (min.price === undefined || min.price === null) return product;
    return product.price < min.price ? product : min;
  }, null);

  if (!cheapest) {
    return "No products are available right now.";
  }

  const price = formatCurrency(cheapest.price);
  const stock = cheapest.quantity ?? "?";
  return `The cheapest product is ${cheapest.title}.\n- Price: ${price}\n- Stock: ${stock}`;
};

const shouldListProducts = (question) => {
  const q = question.toLowerCase();
  return q.includes("products") && (q.includes("available") || q.includes("list") || q.includes("show"));
};

const shouldFindCheapest = (question) => {
  const q = question.toLowerCase();
  return q.includes("cheapest") || q.includes("lowest price");
};

const callHuggingFace = async (prompt) => {
  if (!process.env.HF_API_KEY) {
    return { error: "HF_API_KEY is missing on the server." };
  }

  const payload = {
    model: HF_MODEL_ID,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant for an online marketplace. Answer using ONLY the data provided. Start with a short paragraph, then add bullet points if helpful. If listing products, use bullet points (max 8) with name, price, and stock."
      },
      { role: "user", content: prompt }
    ],
    max_tokens: 150,
    temperature: 0.4
  };

  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(payload)
  });

  const rawText = await response.text();
  let json;
  try {
    json = JSON.parse(rawText);
  } catch {
    return { error: `LLM non-JSON response (status ${response.status}).`, raw: rawText.slice(0, 200) };
  }

  if (json.error) {
    return { error: json.error.message || json.error };
  }

  const choice = json.choices?.[0]?.message?.content || "";
  return { answer: choice.trim() };
};

export const getServices = (req, res) => {
  res.json({ services: servicesData });
};

export const askAi = async (req, res) => {
  try {
    const question = (req.body?.question || "").trim();
    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }

    const [products, totalTransactions, revenueResult] = await Promise.all([
      productModel.find({ status: "available" }).select("title brand price quantity").limit(20).lean(),
      transactionModel.countDocuments(),
      transactionModel.aggregate([{ $group: { _id: null, total: { $sum: "$price" } } }])
    ]);

    const report = {
      totalTransactions,
      totalRevenue: revenueResult[0]?.total || 0
    };

    if (shouldFindCheapest(question)) {
      return res.json({ answer: formatCheapestProductAnswer(products) });
    }

    if (shouldListProducts(question)) {
      return res.json({ answer: formatProductListAnswer(products) });
    }

    const context = buildContext({ products, report, services: servicesData });
    const prompt = `${context}\n\nUser question: ${question}`;
    const llm = await callHuggingFace(prompt);

    if (llm.error) {
      return res.status(502).json({ error: llm.error, raw: llm.raw });
    }

    res.json({ answer: llm.answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

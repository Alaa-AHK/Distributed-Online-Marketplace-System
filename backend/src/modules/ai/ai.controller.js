import { ChatOpenAI } from "@langchain/openai";
import { DynamicTool } from "@langchain/core/tools";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { productModel } from "../../../db/models/product.model.js";
import { transactionModel } from "../../../db/models/transaction.model.js";
import { servicesData } from "./services.data.js";

export const getServices = (req, res) => {
  res.json({ services: servicesData });
};

export const askAi = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required in the request body." });
    }

    // 1. Initialize the Language Model (The Brain)
    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      temperature: 0
    });

    // 2. Define the Tools (The Capabilities)
    const tools = [
      // Inventory Tool
      new DynamicTool({
        name: "inventory_tool",
        description: "Useful for searching products, checking prices, and stock availability.",
        func: async () => {
          const products = await productModel.find({ status: "available" }).limit(10).lean();
          return JSON.stringify(products);
        }
      }),

      // Analytics Tool
      new DynamicTool({
        name: "analytics_tool",
        description: "Useful for answering questions about profits, revenue, and total sales volume.",
        func: async () => {
          const count = await transactionModel.countDocuments();
          const revenue = await transactionModel.aggregate([
            { $group: { _id: null, total: { $sum: "$price" } } }
          ]);
          return `Total Transactions: ${count}, Total Revenue: $${revenue[0]?.total || 0}`;
        }
      })
    ];

    // 3. Design the Prompt (The Orchestrator Instructions)
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a smart assistant for an e-commerce store. You have access to inventory and analytics tools. Use them accurately to answer user questions based ONLY on the data provided."
      ],
      ["human", "{input}"],
      new MessagesPlaceholder("agent_scratchpad")
    ]);

    // 4. Create the Agent
    const agent = await createOpenAIFunctionsAgent({
      llm: model,
      tools,
      prompt
    });

    // 5. The Executor (Manages the Thinking -> Action -> Observation loop)
    const agentExecutor = new AgentExecutor({
      agent,
      tools
    });

    // 6. Execute the workflow
    const result = await agentExecutor.invoke({
      input: question
    });

    res.json({ answer: result.output });
  } catch (error) {
    console.error("AI Agent Error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

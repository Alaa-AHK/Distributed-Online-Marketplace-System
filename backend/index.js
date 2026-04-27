import express from "express";
import { connectDatabases } from "./db/config/db.js";
import { UserRoutes } from "./src/modules/user/user.routes.js";
import { ProductRoutes } from "./src/modules/product/product.routes.js";
import { CartRoutes } from "./src/modules/cart/cart.routes.js";
import { OrderRoutes } from "./src/modules/order/order.routes.js";
import cors from 'cors'
import TransactionRoutes from './src/modules/transaction/transaction.routes.js';


const app=express()

app.use(express.json())

let x=true
const isAuth=(req,res,next)=>{
if(x)next()
  else res.json({message:"not auth"})
}


app.use(cors({
origin:'http://localhost:4200',
credentials: true
}));

app.use(UserRoutes)
app.use(ProductRoutes)
app.use(CartRoutes)
app.use(OrderRoutes)
app.use(TransactionRoutes)

app.get('/health',(req,res)=>{
  res.json({status:"ok"})
})

app.get('/',isAuth,(req,res)=>{
    res.json({message:"done"})
})



// app.listen(3000,()=>{
//     console.log("server running")
// })
connectDatabases().then(() => {
  app.listen(3000, () => console.log(' Server running on port 3000'));
});


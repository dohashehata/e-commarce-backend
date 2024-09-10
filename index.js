// import modules
import express from "express";
import { dbConnection } from "./db/dbConnection.js";
import categoryRouter from "./src/modules/cateogry/category.routes.js";
import { globalErrorHandling } from "./src/utils/appError.js";
import SubCategoryRouter from "./src/modules/subCategory/subCategory.routes.js";
import brandRouter from "./src/modules/brand/brand.router.js";
import productRouter from "./src/modules/product/product.router.js";
import authRouter from "./src/modules/auth/auth.router.js";
import reviewRouter from "./src/modules/review/review.router.js";
import wishlistRouter from "./src/modules/wishlist/wishlist.router.js";
import cartRouter from "./src/modules/cart/cart.router.js";
import couponRouter from "./src/modules/coupon/coupon.router.js";
import orderRouter from "./src/modules/order/order.router.js";
import dotenv from "dotenv"
import path from "path";

// caret server
dotenv.config({path:path.resolve('./config/.env')})
const app = express();
const port = process.env.PORT|| 3000;
// import db
dbConnection()
// pars req
app.use(express.json());
// import routes
app.use('/category',categoryRouter)
app.use('/sub-Category',SubCategoryRouter)
app.use('/brand',brandRouter),
app.use('/product',productRouter)
app.use('/auth',authRouter)
app.use('/review',reviewRouter)
app.use('/wishlist',wishlistRouter)
app.use('/cart',cartRouter)
app.use('/coupon',couponRouter)
app.use('/order',orderRouter)

// listen server
// globalErrorHandling
app.use(globalErrorHandling)
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
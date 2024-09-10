import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
import { asyncHandler } from "../../utils/appError.js";
import { addToCart, deleteFromCart, updateCart } from "./cart.controller.js";

const cartRouter = Router()
// add to cart
cartRouter.post('/', isAuthenticated(),isAuthorized([roles.USER]),asyncHandler(addToCart))


// Delete product from cart
cartRouter.delete('/:productId', isAuthenticated(), isAuthorized([roles.USER]), asyncHandler(deleteFromCart));

// Update product quantity in cart
cartRouter.put('/:productId', isAuthenticated(), isAuthorized([roles.USER]), asyncHandler(updateCart));
export default cartRouter
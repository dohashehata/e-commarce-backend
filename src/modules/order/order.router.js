import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
import { isValid } from "../../middleware/validation.js";
import { isOrderVal } from "./order.validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { createOrder, deleteOrder, updateOrder } from "./order.controller.js";

 const orderRouter =Router()
//  create order 
orderRouter.post('/',isAuthenticated(),isAuthorized(Object.values(roles)),isValid(isOrderVal),asyncHandler(createOrder))



// Update order
orderRouter.put('/:orderId', 
    isAuthenticated(), 
    isAuthorized(Object.values(roles)), 
    isValid(isOrderVal), 
    asyncHandler(updateOrder)
);

// Delete order
orderRouter.delete('/:orderId', 
    isAuthenticated(), 
    isAuthorized(Object.values(roles)), 
    asyncHandler(deleteOrder)
);


export default orderRouter;
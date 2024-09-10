import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
import { asyncHandler } from "../../utils/appError.js";
import { addToWishlist, deleteFromWishlist, getWishlist } from "./wishlist.controller.js";

const wishlistRouter = Router()

// add
wishlistRouter.post('/',isAuthenticated(),isAuthorized([roles.USER]),asyncHandler(addToWishlist) )

// get
wishlistRouter.get('/',isAuthenticated(),isAuthorized([roles.USER]),asyncHandler(getWishlist) )

// delete
wishlistRouter.delete('/:productId', isAuthenticated(), isAuthorized([roles.USER]), asyncHandler(deleteFromWishlist));
export default wishlistRouter
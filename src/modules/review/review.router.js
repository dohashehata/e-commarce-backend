import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
import { asyncHandler } from "../../utils/appError.js";
import { addReview, deleteReview, getReview, updateReview } from "./review.controller.js";
 const reviewRouter = Router()
//  add 
reviewRouter.post('/',isAuthenticated(),isAuthorized(Object.values(roles)),asyncHandler(addReview))

// delate
reviewRouter.delete('/:review',isAuthenticated(),isAuthorized([roles.ADMIN,roles.USER]),asyncHandler(deleteReview))

// get a specific review
reviewRouter.get('/:review', isAuthenticated(), asyncHandler(getReview));

// update a review
reviewRouter.put('/:review', isAuthenticated(), isAuthorized([roles.ADMIN, roles.USER]), asyncHandler(updateReview));
export default reviewRouter


import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
import { isValid } from "../../middleware/validation.js";
import { couponAddVal } from "./coupon.validation.js";
import { createCoupon, deleteCoupon, updateCoupon } from "./coupon.controller.js";
import { asyncHandler } from "../../utils/appError.js";

const couponRouter = Router()

couponRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    isValid(couponAddVal),
    asyncHandler(createCoupon)
)





// Update coupon
couponRouter.put('/:couponId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    isValid(couponAddVal),
    asyncHandler(updateCoupon)
);

// Delete coupon
couponRouter.delete('/:couponId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    asyncHandler(deleteCoupon)
);

export default couponRouter
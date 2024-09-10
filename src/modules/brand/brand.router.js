import { Router } from "express";
import { cloudUpload } from "../../utils/multer-cloud.js";
import { isValid } from "../../middleware/validation.js";
import { createBrandVal, updateBrandVal } from "./brand.validation.js";
import { createBrand, deleteBrand, updateBrand } from "./brand.controller.js";
import { asyncHandler } from "../../utils/appError.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
const brandRouter= Router()

// create brand  authentication  auth
brandRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    cloudUpload({}).single('logo'),
    isValid(createBrandVal),
    asyncHandler(createBrand)
)

// update brand
brandRouter.put('/:brandId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    cloudUpload({}).single('logo'),
    isValid(updateBrandVal),
    asyncHandler(updateBrand)
)

// delete brand
brandRouter.delete('/:brandId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    asyncHandler(deleteBrand)
);

export default brandRouter
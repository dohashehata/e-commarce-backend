import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { fileUpload } from "../../utils/multer.js";
import { subCategoryAddVal, subCategoryUpdateVal } from "./subCategory.validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { addSubCategory,deleteSubCategory,getSubCategory, updateSubCategory } from "./subCategory.controller.js";
import { SubCategory } from "./subCategory.model.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
const SubCategoryRouter= Router()


// add todo authentication&auth
SubCategoryRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    fileUpload({folder:"SubCategory"}).single('image'),
isValid(subCategoryAddVal),
asyncHandler(addSubCategory)
)

// getAll
SubCategoryRouter.get('/:categoryId',asyncHandler(getSubCategory))



 //update  todo authentication & auth   check it
 SubCategoryRouter.put('/:SubCategoryId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    fileUpload({folder:'subCategory'}).single('image'),
    isValid(subCategoryUpdateVal),
    asyncHandler(updateSubCategory)
    )


    // Delete a SubCategory
SubCategoryRouter.delete('/:SubCategoryId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    asyncHandler(deleteSubCategory)
);

export default SubCategoryRouter
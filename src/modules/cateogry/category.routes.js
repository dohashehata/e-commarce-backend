import { Router } from "express";
import { fileUpload } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import { categoryAddSchema, categoryUpdateSchema } from "./cateogry.validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { addCategory , updateCategory,getAllCategories, getCategoriesWithSub, deleteCategory} from "./category.controller.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";

const categoryRouter = Router()

// routes
// add -  authentication & auth
categoryRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    fileUpload({folder:'category'}).single('image'),
    isValid(categoryAddSchema),
    asyncHandler(addCategory)
    )

 //update   authentication & auth
 categoryRouter.put('/:categoryId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    fileUpload({folder:'category'}).single('image'),
    isValid(categoryUpdateSchema),
    asyncHandler(updateCategory)
    )


    // getAll
    categoryRouter.get('/',asyncHandler(getAllCategories))

    // getCategoriesWithSub
    categoryRouter.get('/categoriesWithSub',
        isAuthenticated(),
        isAuthorized([roles.ADMIN]),
        asyncHandler(getCategoriesWithSub))


        // Delete category - authentication & authorization
categoryRouter.delete('/:categoryId',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    asyncHandler(deleteCategory)
);

export default categoryRouter
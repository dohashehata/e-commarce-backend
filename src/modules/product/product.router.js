import { Router} from "express";
import { cloudUpload } from "../../utils/multer-cloud.js";
import { isValid } from "../../middleware/validation.js";
import { addProductVal } from "./product.validation.js";
import { asyncHandler } from "../../utils/appError.js";
import { addProduct, deleteProduct, getAllProduct, updateProduct } from "./product.controller.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
const productRouter=Router()
// add todo authentication auth
productRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    cloudUpload({}).fields([
    {name:"mainImages",maxCount:1},
    {name:"supImages",maxCount:5}
]),
isValid(addProductVal),
asyncHandler(addProduct)
)


// getAll
productRouter.get('/',asyncHandler(getAllProduct))



// Update product (Update)
productRouter.put('/:id',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    cloudUpload({}).fields([
      { name: "mainImages", maxCount: 1 },
      { name: "supImages", maxCount: 5 }
    ]),
    asyncHandler(updateProduct)
  );
  
  // Delete product (Delete)
  productRouter.delete('/:id',
    isAuthenticated(),
    isAuthorized([roles.ADMIN]),
    asyncHandler(deleteProduct)
  );
export default productRouter
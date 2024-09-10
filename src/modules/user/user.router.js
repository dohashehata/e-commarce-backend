// import { Router} from "express";
// import { cloudUpload } from "../../utils/multer-cloud.js";
// import { isValid } from "../../middleware/validation.js";
// import { addProductVal } from "./product.validation.js";
// import { asyncHandler } from "../../utils/appError.js";
// import { addProduct, getAllProduct } from "./product.controller.js";
// const productRouter=Router()
// // add todo authentication auth
// productRouter.post('/',cloudUpload({}).fields([
//     {name:"mainImages",maxCount:1},
//     {name:"supImages",maxCount:5}
// ]),
// isValid(addProductVal),
// asyncHandler(addProduct)
// )


// // getAll
// productRouter.get('/',asyncHandler(getAllProduct))

// export default productRouter
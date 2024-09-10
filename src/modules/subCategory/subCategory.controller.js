// import modules
import slugify from "slugify";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import { Category } from "../cateogry/category.model.js";
import {SubCategory} from "./subCategory.model.js";
import { deleteFile } from "../../utils/file.functions.js";

// add
 const addSubCategory = async (req, res, next) => {
    // get data from req
    const {name,categoryId}=req.body
    // check file
    if(!req.file){
        return next(new AppError(messages.file.required,400))
    }
    // check existence
    const categoryExist = await Category.findById(categoryId)
    if(!categoryExist){
        return next(new AppError(messages.category.notFound,404))
    }
  // check name existence
    const nameExist = await SubCategory.findOne({name,category:categoryId})
    if (nameExist){
        return next(new AppError(messages.subCategory.alreadyExist,409))
    }
   // prepare data
    const slug= slugify(name)
    const subCategory =new SubCategory({
        name,
        slug,
        category:categoryId,
        image:{path:req.file.path}
    })
   // add to db
    const createtedSubCategory = await subCategory.save()
    if(!createtedSubCategory){
        return next(new AppError(messages.subCategory.failToCreat,500))
}
 // send response
    return res.status(201).json({
        messages:messages.subCategory.successCreate,
        success:true,
        data:createtedSubCategory
    })


}


// get
const getSubCategory = async (req, res, next) => {
    // get data from req
    const {categoryId}=req.params
    // check existence
    const categoryExist = await Category.findById(categoryId)
    if(!categoryExist){
        return next(new AppError(messages.category.notFound,404))
    }
    // get from db
    const subCategory = await SubCategory.find({category:categoryId}).populate([{path:"category"}])
    if(!subCategory){
        return next(new AppError(messages.subCategory.notFound,404))
    }
    // send response
    return res.status(200).json({
        sucsess:true,
        data:subCategory
    })
   


}


// updateCategory
// const updateSubCategory = async(req,res,next)=> {
//     // get data from req
//     let {name}= req.body
//     let{SubCategoryId}=req.params
//     // check existence
//     const SubCategoryExist = await SubCategory.findById(SubCategoryId)
//     if(!SubCategoryExist){
//         return next(new AppError(messages.subCategory.notFound,404))
//     }
//     // check name existence
//     const nameExist = await SubCategory.findOne({name,_id:{$ne:SubCategoryId}})
//     if (nameExist){
//         return next(new AppError(messages.subCategory.alreadyExist,409))
//     }
//     // prepare data
   
//     if (name) {
//         SubCategoryExist.slug = slugify(name);
//     }
    
 
    
//     // update image
//     if(req.file){
//         deleteFile(SubCategoryExist.image.path)
//     SubCategoryExist.image={path:req.file.path}
//     SubCategoryExist.markModified("image")
//     }
//     // updated to db
//    const updatedSubCategory= await SubCategoryExist.save()
//    if(!updatedSubCategory){
//     return next (new AppError(messages.subCategory.failToUpdate,500))
//    }
// //    send res
// return res.status(200).json({
//     messages:messages.subCategory.successUpdate,
//     success:true,
//     date:updatedSubCategory
// })
// }



const updateSubCategory = async(req, res, next) => {
    // get data from req
    let { name } = req.body;
    let { SubCategoryId } = req.params;

    // check existence
    const SubCategoryExist = await SubCategory.findById(SubCategoryId);
    if (!SubCategoryExist) {
        return next(new AppError(messages.subCategory.notFound, 404));
    }

    // check name existence
    const nameExist = await SubCategory.findOne({ name, _id: { $ne: SubCategoryId } });
    if (nameExist) {
        return next(new AppError(messages.subCategory.alreadyExist, 409));
    }

    // update name and slug
    if (name) {
        SubCategoryExist.name = name;  // Update the name field
        SubCategoryExist.slug = slugify(name);  // Update the slug
    }

    // update image
    if (req.file) {
        deleteFile(SubCategoryExist.image.path);
        SubCategoryExist.image = { path: req.file.path };
        SubCategoryExist.markModified("image");
    }

    // update to db
    const updatedSubCategory = await SubCategoryExist.save();
    if (!updatedSubCategory) {
        return next(new AppError(messages.subCategory.failToUpdate, 500));
    }

    // send response
    return res.status(200).json({
        messages: messages.subCategory.successUpdate,
        success: true,
        data: updatedSubCategory
    });
}














// deleteSubCategory
const deleteSubCategory = async (req, res, next) => {
    // get data from req
    const { SubCategoryId } = req.params;

    // check existence
    const SubCategoryExist = await SubCategory.findById(SubCategoryId);
    if (!SubCategoryExist) {
        return next(new AppError(messages.subCategory.notFound, 404));
    }

    // delete image
    if (SubCategoryExist.image && SubCategoryExist.image.path) {
        deleteFile(SubCategoryExist.image.path);
    }

    // delete from db
    const deletedSubCategory = await SubCategoryExist.deleteOne();
    if (!deletedSubCategory) {
        return next(new AppError(messages.subCategory.failToDelete, 500));
    }

    // send response
    return res.status(200).json({
        message: messages.subCategory.successDelete,
        success: true,
        data: deletedSubCategory,
    });
};


export{
    addSubCategory,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory
}
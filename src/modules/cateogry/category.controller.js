
import slugify from "slugify"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { Category } from "./category.model.js"
import { deleteFile } from "../../utils/file.functions.js"
import pkg from 'joi';
const { date } = pkg;

// // addCategory
// const addCategory = async(req,res,next)=> {
// // get data from req
// let {name}=req.body
// name = name.toLowerCase()
// // check file
// if(!req.file) {
//     return next(new AppError(messages.file.required,400))
// }
// //existence
// const categoryExist = await Category.findOne()
// if(categoryExist){
// return next( new AppError (messages.category.alreadyExist,409))
// }
// // peeper data
// const slug= slugify(name)
// const category =new Category({
//     name,
//     slug,
//     image:{path: req.file.path}
// })
// // add to db
// const createtedCategory = await category.save()
// if(!createtedCategory){
//     return next(new AppError(messages.failToCreate,500))

// }

// return res.status(200).json({ 
//     messages:messages.category.successCreate,
//     success:true,
//     data:createtedCategory
// })


// }



const addCategory = async (req, res, next) => {
    let { name } = req.body;
    name = name.toLowerCase();

    // Check if file exists
    if (!req.file) {
        return next(new AppError(messages.file.required, 400));
    }

    // Check if category already exists
    const categoryExist = await Category.findOne({ name });
    if (categoryExist) {
        deleteFile(req.file.path); // Rollback file upload
        return next(new AppError(messages.category.alreadyExist, 409));
    }

    try {
        // Prepare category data
        const slug = slugify(name);
        const category = new Category({
            name,
            slug,
            image: { path: req.file.path }
        });

        // Save to database
        const createdCategory = await category.save();
        if (!createdCategory) {
            deleteFile(req.file.path); // Rollback file upload if saving fails
            return next(new AppError(messages.failToCreate, 500));
        }

        return res.status(200).json({
            messages: messages.category.successCreate,
            success: true,
            data: createdCategory
        });

    } catch (error) {
        deleteFile(req.file.path); // Rollback file upload if error occurs
        return next(new AppError(error.message, 500));
    }
};

// updateCategory (same as before)
const updateCategory = async (req, res, next) => {
    let { name } = req.body;
    let { categoryId } = req.params;

    const categoryExist = await Category.findById(categoryId);
    if (!categoryExist) {
        return next(new AppError(messages.category.notFound, 404));
    }

    const nameExist = await Category.findOne({ name, _id: { $ne: categoryId } });
    if (nameExist) {
        return next(new AppError(messages.category.alreadyExist, 409));
    }

    if (name) {
        categoryExist.slug = slugify(name);
    }

    if (req.file) {
        deleteFile(categoryExist.image.path);
        categoryExist.image = { path: req.file.path };
        categoryExist.markModified("image");
    }

    const updatedCategory = await categoryExist.save();
    if (!updatedCategory) {
        return next(new AppError(messages.category.failToUpdate, 500));
    }

    return res.status(200).json({
        messages: messages.category.successUpdate,
        success: true,
        date: updatedCategory
    });
};



// updateCategory
// const updateCategory = async(req,res,next)=> {
//     // get data from req
//     let {name}= req.body
//     let{categoryId}=req.params
//     // check existance
//     const categoryExist = await Category.findById(categoryId)
//     if(!categoryExist){
//         return next(new AppError(messages.category.notFound,404))
//     }
//     // check name existance
//     const nameExist = await Category.findOne({name,_id:{$ne:categoryId}})
//     if (nameExist){
//         return next(new AppError(messages.category.alreadyExist,409))
//     }
//     //  peeper data
//    if(name){
//     categoryExist.slug=slugify(name)
//    }
    
//     // update image
//     if(req.file){
//         deleteFile(categoryExist.image.path)
//     categoryExist.image={path:req.file.path}
//     categoryExist.markModified("image")
//     }
//     // updated to db
//    const updatedCategory= await categoryExist.save()
//    if(!updatedCategory){
//     return next (new AppError(messages.category.failToUpdate,500))
//    }
// //    send res
// return res.status(200).json({
//     messages:messages.category.successUpdate,
//     success:true,
//     date:updatedCategory
// })
// }

// getAllCategories
const getAllCategories = async(req,res,next)=> {
    const categories = await Category.find()
    return res.status(200).json({success:true,data:categories})

}

// getCategoriesWithSub
const getCategoriesWithSub = async(req,res,next)=> {
    const categories = await Category.find().populate([{path:'subcategories'}])
    return res.status(200).json({success:true,data:categories})

}


// deleteCategory
const deleteCategory = async (req, res, next) => {
    const { categoryId } = req.params;

    // Find the category by ID
    const category = await Category.findById(categoryId);
    if (!category) {
        return next(new AppError(messages.category.notFound, 404));
    }

    // Delete category image file
    deleteFile(category.image.path);

    // Delete category from DB
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
        return next(new AppError(messages.category.failToDelete, 500));
    }

    return res.status(200).json({
        messages: messages.category.successDelete,
        success: true,
        data: deletedCategory
    });
};


export {
    addCategory,
    updateCategory,
    getAllCategories,
    getCategoriesWithSub,
    deleteCategory

}
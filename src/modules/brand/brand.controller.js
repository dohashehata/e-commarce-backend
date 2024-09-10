import slugify from "slugify"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { Brand } from "./brand.model.js"
import cloudinary from "../../utils/cloud.js"


// create brand
// export const createBrand = async(req,res,next)=>{
// // get data from req
// let {name}=req.body
// name=name.toLowerCase()
// // check image 
// if(!req.file){
//     return next (new AppError(messages.file.required,400))
// }
// // check existence
// const brandExist=await Brand.findOne({name})
// if(brandExist){
//     return next (new AppError(messages.brand.alreadyExist,409))
// }
// // prepare data
// const slug =slugify(name)
// const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
//     folder:"firstApp/brand"
// })
// const brand = new Brand({
//     name,
//     slug,
//     logo:{secure_url,public_id},
//     // todo createdBy token
// })

// // add to db
// const createdBrand = await brand.save()
// if(!createdBrand){
//     // rollback
//     return next (new AppError(messages.brand.failToCreate,500))
// }
// // send res
// res.status(201).json({message:messages.brand.successCreate,
//     success:true,
//     data:createdBrand
// })
// }


export const createBrand = async (req, res, next) => {
    // Get data from request
    let { name } = req.body;
    name = name.toLowerCase();

    // Check if an image is uploaded
    if (!req.file) {
        return next(new AppError(messages.file.required, 400));
    }

    // Check if the brand already exists
    const brandExist = await Brand.findOne({ name });
    if (brandExist) {
        return next(new AppError(messages.brand.alreadyExist, 409));
    }

    // Upload logo to Cloudinary
    const slug = slugify(name);
    let logo;
    try {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: "firstApp/brand",
        });
        logo = { secure_url, public_id };
    } catch (error) {
        return next(new AppError(messages.file.uploadError, 500));
    }

    // Prepare data for the brand
    const brand = new Brand({
        name,
        slug,
        logo,
        createdBy: req.authUser._id,  // Set createdBy from token
    });

    // Save brand to the database
    try {
        const createdBrand = await brand.save();
        res.status(201).json({
            message: messages.brand.successCreate,
            success: true,
            data: createdBrand,
        });
    } catch (error) {
        // Rollback: Remove uploaded logo from Cloudinary if saving failed
        if (logo && logo.public_id) {
            await cloudinary.uploader.destroy(logo.public_id);
        }
        return next(new AppError(messages.brand.failToCreate, 500));
    }
};


// updateBrand
export const updateBrand = async(req,res,next)=> {
    // get data from req
    let {name}= req.body
    name=name.toLowerCase()
    let{brandId}=req.params
    console.log(brandId);
    
    // check existence
    const brandExist = await Brand.findById(brandId)
    if(!brandExist){
        return next(new AppError(messages.brand.notFound,404))
    }
    // check name existence
   if(name){
    const nameExist = await Brand.findOne({name,_id:{$ne:brandId}})
    if (nameExist){
        return next(new AppError(messages.brand.alreadyExist,409))
    }
    brandExist.name=name
   }
    // prepare data
   if(name){
    brandExist.slug=slugify(name)
   }
    
    // update logo
    if(req.file){
        // remove old image
    //    await cloudinary.uploader.destroy(brandExist.logo.public_id)
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{

        public_id:brandExist.logo.public_id
       })
       brandExist.logo={secure_url,public_id}
    }
    // updated to db
   const updatedBrand= await brandExist.save()
   if(!updatedBrand){
    // rollback
    return next (new AppError(messages.brand.failToUpdate,500))
   }
//    send res
return res.status(200).json({
    messages:messages.brand.successUpdate,
    success:true,
    date:updatedBrand
})
}

// delete brand
export const deleteBrand = async (req, res, next) => {
    const { brandId } = req.params;

    // Check if the brand exists
    const brandExist = await Brand.findById(brandId);
    if (!brandExist) {
        return next(new AppError(messages.brand.notFound, 404));
    }

    // Remove logo from Cloudinary if it exists
    if (brandExist.logo.public_id) {
        await cloudinary.uploader.destroy(brandExist.logo.public_id);
    }

    // Delete the brand from the database
    const deletedBrand = await Brand.findByIdAndDelete(brandId);
    if (!deletedBrand) {
        return next(new AppError(messages.brand.failToDelete, 500));
    }

    // Send response
    res.status(200).json({
        message: messages.brand.successDelete,
        success: true,
        data: deletedBrand
    });
};
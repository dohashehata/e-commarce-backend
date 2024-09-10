// import slugify from "slugify"
// import { AppError } from "../../utils/appError.js"
// import cloudinary from "../../utils/cloud.js"
// import { messages } from "../../utils/constant/messages.js"
// import { Brand } from "../brand/brand.model.js"
// import { SubCategory } from "../subCategory/subCategory.model.js"
// import { Product } from "./user.model.js"
// import { ApiFeature } from "../../utils/apiFeature.js"


// // add Product
// export const addProduct=async(req,res,next)=>{
//     // get date from req
//     const {name,description,category,subCategory,brand,price,discount,colors,sizes,stoke}=req.body
//     // console.log(req.body);
//     // check existence
//     const brandExist =await Brand.findById(brand)
//     if(!brandExist){
//         return next(new AppError(messages.brand.notFound,404))
//     }
// const subCategoryExist= await SubCategory.findById(subCategory)
// if(!subCategoryExist){
//     return next(new AppError(messages.subCategory.notFound,404))
// }
    

// // upload
// const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.mainImages[0].path,{folder:"firstApp/Product/mainImages"})
// let mainImages ={secure_url,public_id}
// let supImages= []
// for(const file of req.files.supImages) {
//     const {secure_url,public_id}= await cloudinary.uploader.upload(file.path,{folder:"firstApp/Product/supImages"})
//     supImages.push({secure_url,public_id})
// }
//     // add Db
//     const product= new Product({
//         name,
//         slug:slugify(name),
//         description,
//         category,
//         subCategory,
//         brand,
//         price,
//         discount,
//         colors:JSON.parse(colors),
//         sizes:JSON.parse(sizes),
//         stoke,
//         mainImages,
//         supImages
//     })
// const createdProduct= await product.save()


// if(!createdProduct){
//     // rollback
//     return next(new AppError(messages.product.failToCreate,404))
// }
// res.status(201).json({
//     message:messages.product.successCreate,
//     status:true,
//     data:createdProduct
// })


// }



// // getAll
// export const getAllProduct = async(req, res, next)=> {
//     let {page , size, sort , select,...filter} = req.query

// const apiFeature= new ApiFeature(Product.find(),req.query).pagination().sort().select().filter()
//  const product =  await apiFeature.mongooseQuery
// const mongooseQuery=Product.find(filter,{},{})
// const products=await mongooseQuery
// for (const product of products) {
//     delete product.finalPrice
// }
//     return res.status(200).json({success:true,data:product,metaData:apiFeature.queryData.metaData })










    
    // filter=JSON.parse(JSON.stringify(filter).replace(/gt|gte|lt|lte/g,(match)=>`$${match}`))

    // const excludeFields = ['page' , 'size', 'sort' , 'select']
    // const filter = {...req.query}
    // excludeFields.forEach((ele)=>{
    //     delete filter[ele]
    // })


    // if (!page || page<=1){
    //    page = 1

    // }
    // if (!size || size<=1){
    //     size = 3
 
    //  }
    // page=parseInt(page)
    // size=parseInt(size)
    // const skip =(page - 1) * size
    // sort = sort?.replaceAll(',','')
    // select = select?.replaceAll(',','')
    // const products=await Product.find(filter).limit(size).skip(skip).sort(sort).select(select)

    // return res.status(200).json({success:true,data:products, metadata:{page, size, nextPage:page +1} })

// }
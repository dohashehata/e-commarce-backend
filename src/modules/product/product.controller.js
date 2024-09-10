import slugify from "slugify"
import { AppError } from "../../utils/appError.js"
import cloudinary from "../../utils/cloud.js"
import { messages } from "../../utils/constant/messages.js"
import { Brand } from "../brand/brand.model.js"
import { SubCategory } from "../subCategory/subCategory.model.js"
import { Product } from "./product.model.js"
import { ApiFeature } from "../../utils/apiFeature.js"


// add Product
export const addProduct=async(req,res,next)=>{
    // get date from req
    const {name,description,category,subCategory,brand,price,discount,colors,sizes,stoke}=req.body
    // console.log(req.body);
    // check existence
    const brandExist =await Brand.findById(brand)
    if(!brandExist){
        return next(new AppError(messages.brand.notFound,404))
    }
const subCategoryExist= await SubCategory.findById(subCategory)
if(!subCategoryExist){
    return next(new AppError(messages.subCategory.notFound,404))
}
    

// upload
const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.mainImages[0].path,{folder:"firstApp/Product/mainImages"})
let mainImages ={secure_url,public_id}
let supImages= []
for(const file of req.files.supImages) {
    const {secure_url,public_id}= await cloudinary.uploader.upload(file.path,{folder:"firstApp/Product/supImages"})
    supImages.push({secure_url,public_id})
}
    // add Db
    const product= new Product({
        name,
        slug:slugify(name),
        description,
        category,
        subCategory,
        brand,
        price,
        discount,
        colors:JSON.parse(colors),
        sizes:JSON.parse(sizes),
        stoke,
        mainImages,
        supImages
    })
const createdProduct= await product.save()


if(!createdProduct){
    // rollback
    return next(new AppError(messages.product.failToCreat,404))
}
res.status(201).json({
    message:messages.product.successCreate,
    status:true,
    data:createdProduct
})


}



// getAll
export const getAllProduct = async(req, res, next)=> {
    let {page , size, sort , select,...filter} = req.query

const apiFeature= new ApiFeature(Product.find(),req.query).pagination().sort().select().filter()
 const product =  await apiFeature.mongooseQuery
const mongooseQuery=Product.find(filter,{},{})
const products=await mongooseQuery
for (const product of products) {
    delete product.finalPrice
}
    return res.status(200).json({success:true,data:product,metaData:apiFeature.queryData.metaData })




}


// Update Product
export const updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const { name, description, category, subCategory, brand, price, discount, colors, sizes, stoke } = req.body;
  
    // Find product
    const product = await Product.findById(id);
    if (!product) {
      return next(new AppError(messages.product.notFound, 404));
    }
  
    // Update fields
    product.name = name || product.name;
    product.slug = name ? slugify(name) : product.slug;
    product.description = description || product.description;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;
    product.brand = brand || product.brand;
    product.price = price || product.price;
    product.discount = discount || product.discount;
    product.colors = colors ? JSON.parse(colors) : product.colors;
    product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
    product.stoke = stoke || product.stoke;
  
    // Handle image updates if new images are uploaded
    if (req.files.mainImages) {
      // Delete old main image from Cloudinary
      await cloudinary.uploader.destroy(product.mainImages.public_id);
      
      const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImages[0].path, { folder: "firstApp/Product/mainImages" });
      product.mainImages = { secure_url, public_id };
    }
  
    if (req.files.supImages) {
      // Delete old supplementary images from Cloudinary
      for (const image of product.supImages) {
        await cloudinary.uploader.destroy(image.public_id);
      }
      
      let supImages = [];
      for (const file of req.files.supImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: "firstApp/Product/supImages" });
        supImages.push({ secure_url, public_id });
      }
      product.supImages = supImages;
    }
  
    const updatedProduct = await product.save();
    res.status(200).json({ success: true, message: messages.product.successUpdate, data: updatedProduct });
  };
  
  // Delete Product
  // Delete Product
export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  
  const product = await Product.findById(id);
  if (!product) {
    return next(new AppError(messages.product.notFound, 404));
  }

  // Delete product images from Cloudinary
  await cloudinary.uploader.destroy(product.mainImages.public_id);
  for (const image of product.supImages) {
    await cloudinary.uploader.destroy(image.public_id);
  }

  // Delete product from the database
  await product.deleteOne(); // Use deleteOne instead of remove

  res.status(200).json({ success: true, message: messages.product.successDelete });
};

  
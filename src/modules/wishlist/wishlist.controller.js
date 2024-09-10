import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { Product } from "../product/product.model.js"
import { User } from "../user/user.model.js"


// addToWishlist

export const addToWishlist = async (req, res, next) => {
     const { productId } = req.body;
 
     // Add to wishlist
     const updateUser = await User.findByIdAndUpdate(
         req.authUser._id,
         { $addToSet: { wishList: productId } },
         { new: true }
     );
 
     if (!updateUser) {
         return next(new AppError('Failed to update user wishlist', 500));
     }
 
     return res.status(200).json({
         message: `${productId} added to wishlist successfully`,
         success: true,
         data: updateUser
     });
 };




//  get wishlist from logged user
export const getWishlist = async (req, res, next) => {

    const user = await User.findById(req.authUser._id,{wishList:1},{populate:[{path:'wishList'}]});
    return res.status(200).json({data:user})

}
 


export const deleteFromWishlist = async (req, res, next) => {
    const { productId } = req.params; 

    // Remove the product from the wishlist
    const updateUser = await User.findByIdAndUpdate(
        req.authUser._id,
        { $pull: { wishList: productId } }, 
        { new: true }
    ).select('wishList'); 

    if (!updateUser) {
        return next(new AppError('Failed to update user wishlist', 500));
    }

    return res.status(200).json({
        message: `${productId} removed from wishlist successfully`,
        success: true,
        data: updateUser
    });
};

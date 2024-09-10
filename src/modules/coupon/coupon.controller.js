import { AppError } from "../../utils/appError.js";
import { couponTypes } from "../../utils/constant/enum.js";
import { messages } from "../../utils/constant/messages.js";
import { Coupon } from "./coupon.model.js";

export const createCoupon=async(req,res,next)=>{
    // get data from req
    const {couponType,discount,code,formDate,toDate}=req.body;
    // check existence
    const couponExist=await Coupon.findOne({code});
    if(couponExist){
        return next(new AppError(messages.coupon.alreadyExist,409));
    }
// check amount
    if(couponType==couponTypes.PERCENTAGE && discount > 100){
        return next(new AppError("must between0,100",400));
    }
// crete coupon
const createdCoupon= await Coupon.create({couponType,discount,code,formDate,toDate,createdBy:req.authUser._id})
console.log(discount);

  
    // send response
    res.status(201).json({
        message:messages.coupon.successCreate,
        success:true,
        data:createdCoupon
})


}


// Update an existing coupon
export const updateCoupon = async (req, res, next) => {
    const { couponId } = req.params;
    const { couponType, discount, code, formDate, toDate } = req.body;

    // Find coupon by ID
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
        return next(new AppError(messages.coupon.notFound, 404));
    }

    // Check discount for percentage type coupons
    if (couponType == couponTypes.PERCENTAGE && discount > 100) {
        return next(new AppError("Discount must be between 0 and 100 for percentage type coupons", 400));
    }

    // Update coupon details
    coupon.couponType = couponType || coupon.couponType;
    coupon.discount = discount || coupon.discount;
    coupon.code = code || coupon.code;
    coupon.formDate = formDate || coupon.formDate;
    coupon.toDate = toDate || coupon.toDate;

    await coupon.save();

    // Send response
    res.status(200).json({
        message: messages.coupon.successUpdate,
        success: true,
        data: coupon
    });
};

// Delete a coupon
export const deleteCoupon = async (req, res, next) => {
    const { couponId } = req.params;

    // Find and delete coupon by ID
    const deletedCoupon = await Coupon.findByIdAndDelete(couponId);
    if (!deletedCoupon) {
        return next(new AppError(messages.coupon.notFound, 404));
    }

    // Send response
    res.status(200).json({
        message: messages.coupon.successDelete,
        success: true
    });
};
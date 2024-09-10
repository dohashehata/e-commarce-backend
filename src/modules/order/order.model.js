
import { model, Schema } from "mongoose";
import { paymentMethod } from "../../utils/constant/enum.js";



const orderSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
   products:[
    {
        productId:{
            type:Schema.Types.ObjectId,
            ref:'Product'
        },
        quantity:{type:Number,default:1},
        price:Number,
        finalPrice:Number,
        discount:Number
    }
   ],
   address:{
    Phone:String,
    street:String

   },
   paymentMethod:{
    type:String,
    enum:Object.values(paymentMethod),
    default:paymentMethod.CASH
   },
   status:{
    type:String,
    enum:['pending','shipped','delivered','cancelled'],
    default:'pending'
   },
   couponId:{
    couponId:{type:Schema.Types.ObjectId,ref:"Coupon"},
    discount:Number,
    code:String
   },
   orderPrice:Number,
   name:String,
   finalPrice:Number
},{timestamps:true})

export const Order = model('Order',orderSchema)
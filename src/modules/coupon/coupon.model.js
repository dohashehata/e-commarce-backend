import joi from "joi";
import { model, Schema } from "mongoose";
import { couponTypes } from "../../utils/constant/enum.js";

const couponSchema = new Schema({
code:String,
discount: Number,
couponType:{
    type:String,
    enum: Object.values(couponTypes)['fixed','percent'],
    default:couponTypes.FIXED
},
formDate:{
    type:Date,
    require:true
},
toDate:{
    type:String,
    require:true
},
assignedToUser:[
    {
    userId:{type:Schema.Types.ObjectId,ref:'User'},
    maxUse:{type:Number,max:5},
    useCount:Number
    }
],
createdBy:{type:Schema.Types.ObjectId,ref:'User'},

},
    {
        timestamps: true,

    }
)


export const Coupon = model('Coupon', couponSchema)


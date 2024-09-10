import pkg from 'joi';

import { model, Schema } from "mongoose";
const { object } = pkg;
// schema
const categorySchema = new Schema(
    {
        name:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        slug:{
            type:String,
            required:true
        },
        image:Object,
        createdBy:{
            type:Schema.Types.ObjectId,
            ref:"User",
            // required:true  

        }

},{
    timestamps:true,
    toJSON:{virtual:true},
    toObject:true
})
categorySchema.virtual('subcategories',{
    localField:"_id",
    foreignField:"category",
    ref:'SubCategory'
})
// model
export const Category = model('Category',categorySchema)
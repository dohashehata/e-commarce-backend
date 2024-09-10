import pkg from 'joi';
import { model, Schema } from "mongoose";
const { object } = pkg;
// schema
const SubCategorySchema = new Schema(
    {
        name:String,
        image:Object,
        slug:String,
        category:{
            type:Schema.Types.ObjectId,
            ref:"Category",
            required:true
        },
        createdBy:{
            type:Schema.Types.ObjectId,
            ref:"User",
            // required:true  

        }

},{
    timestamps:true
})
// model
export const SubCategory = model('SubCategory',SubCategorySchema)
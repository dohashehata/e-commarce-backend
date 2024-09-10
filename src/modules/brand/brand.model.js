import pkg from 'joi';
import { model, Schema } from "mongoose";
const { object } = pkg;
// schema
const brandSchema = new Schema(
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
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        image:Object,
        createdBy:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true  

        },
        logo:{
            secure_url:String,
            public_id:String

        }

},{
    timestamps:true
})
// model
export const Brand = model('Brand',brandSchema)
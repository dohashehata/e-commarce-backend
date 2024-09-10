import pkg from 'joi';
import { model, Schema } from "mongoose";
import { roles, status } from '../../utils/constant/enum.js';
const { object } = pkg;
// schema
const userSchema = new Schema(
    {
        // ==== name === //
        name:{
            type:String,
            unique:true,
            lowercase:true,
            trim:true
        },
        // ==== email === //
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        // ==== password === //
        password:{
            type:String,
            required:true
        },
        // ==== phone === //
        phone:{
            type:String,
            // unique:true,
            trim:true,
            required:true
        },
        // ==== address === //
        address:{
            type:String,
            trim:true
        },
        // ==== role === //
        role:{
            type:String,
            enum:Object.values(roles),
            default:roles.USER
        },
        // ==== status === //
        status:{
            type:String,
            enum:Object.values(status),
            default:status.PENDING
        },
        // ==== active === //
        active:{
            type:Boolean,
            default:false
        },
        // ==== DOB === //
        DOB:{
            type:Date
        },
        // ==== img === //
        image:{
            secure_url:{type:String,default:'https://res.cloudinary.com/di9pr1vqi/image/upload/v1725385508/images_dgh2ih.jpg'},
            public_id:{type:String,default:'https://res.cloudinary.com/di9pr1vqi/image/upload/v1725385508/images_dgh2ih.jpg'}
        },
        // wish list
        wishList:[
            {
        
                    type:Schema.Types.ObjectId,
                    ref:'Product'
                }
            
        ]


},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})


// model
export const User = model('User',userSchema)


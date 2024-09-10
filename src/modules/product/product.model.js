import pkg from 'joi';
import { model, Schema } from "mongoose";
const { object } = pkg;
// schema
const productSchema = new Schema(
    {
        // ==== name === //
        name:{
            type:String,
            required:true,
            lowercase:true,
            trim:true
        },
        slug:{
            type:String,
            required:true,
        
            lowercase:true,
            trim:true
        },
        description:{
            type:String,
            required:true,
            lowercase:true,
            trim:true
        },
          // ==== relatedId === //
       category:{
           type:Schema.Types.ObjectId,
           ref:"Category",
           required:true

       },
       subCategory:{
        type:Schema.Types.ObjectId,
        ref:"SubCategory",
        required:true
       },
       brand:{
        type:Schema.Types.ObjectId,
        ref:"Brand",
        required:true
       },
       createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        // required:true  
       },
       updatedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        // required:true  
       },
  // ==== images === //
  mainImages:Object,
  supImages:[Object],

// ==== price === //
price:{
    type:Number,
    required:true,
    min:0
},
discount:{
    type:Number,
    min:0,
    max:100
},
// ==== properties === //
colors:[String],
sizes:[String],
stoke:{
    type:Number,
    default:1,
    min:0
},
// ==== rate === //
rate:{
    type:Number,
    min:0,
    max:5,
    default:3
},


},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

// virtual
productSchema.virtual('finalPrice').get(function () {
    return this.price - (this.price * ((this.discount|| 0)/ 100)) 
    
})



productSchema.methods.inStoke=function(quantity){
return this.stoke < quantity?false:true
}
// model
export const Product = model('Product',productSchema)
import { model, Schema } from "mongoose";

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      
    },
    products: [
        {
            productId:{
                type:Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },
            quantity: { type:Number,default:1},
            
           

        }
    ]
})

export const Cart = model('Cart', cartSchema)
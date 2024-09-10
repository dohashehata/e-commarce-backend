import joi from "joi"
import { paymentMethod } from "../../utils/constant/enum.js"
import { generalFields } from "../../middleware/validation.js"

export const isOrderVal = joi.object({
  
Phone:joi.string(),
street:joi.string(),

    paymentMethod:joi.string().valid(...Object.values(paymentMethod)),
  
    coupon:joi.string(),
      

})
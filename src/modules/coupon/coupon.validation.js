import joi from "joi";
import { couponTypes } from "../../utils/constant/enum.js";

export const couponAddVal = joi.object({
    code:joi.string().required(),
    discount:joi.number().positive(),
    couponType:joi.string().valid(...Object.values(couponTypes)),
    formDate:joi.date().greater(Date.now()-(24*6*60*1000)),
    toDate:joi.date().greater(joi.ref('formDate'))
   
})
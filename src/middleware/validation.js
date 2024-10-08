// import modules
import joi from 'joi'
// import pkg from 'joi';
// const { date } = pkg;
import { AppError } from "../utils/appError.js"
const parsArray = (value,helper)=>{
let parsedVal=JSON.parse(value)
let schema = joi.array().items(joi.string())
const {error}=schema.validate(parsedVal,{abortEarly:false})
if(error){
  return helper('invalid data')
}else{
  return true
}
}
export const generalFields={
    name:joi.string(),
    description:joi.string().max(1000),
    objectId:joi.string().hex().length(24),
    price:joi.number().min(0),
    discount:joi.number().min(0),
    colors:joi.custom(parsArray),
    sizes:joi.custom(parsArray),
    stoke:joi.number()
}
export const isValid = (schema)=>{

    return (req,res,next)=>{
        let data= {...req.body ,...req.params,...req.query}
      const {error} =  schema.validate =(data,{abortEarly:false})

      if(error){
        const errArr =[]
        error.details.forEach((err)=>{ errArr.push(err.message)})

        next(new AppError(errArr,400))
      }
next()
    }
}
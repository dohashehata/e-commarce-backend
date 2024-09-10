// import modules
import joi from "joi"
import { generalFields } from "../../middleware/validation.js"

// schema
export const categoryAddSchema = joi.object({
    name:generalFields.name.required()
})

export const categoryUpdateSchema = joi.object({
    name:generalFields.name,
    categoryId:generalFields.objectId.required()
})
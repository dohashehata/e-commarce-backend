// import modules
import joi from "joi"
import { generalFields } from "../../middleware/validation.js"

// Val
export const subCategoryAddVal = joi.object({
    name:generalFields.name.required(),
    categoryId:generalFields.objectId.required()
})

export const subCategoryUpdateVal = joi.object({
    name:generalFields.name,
    subCategoryId:generalFields.objectId.required()
})
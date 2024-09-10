// import modules
import joi from "joi"
import { generalFields } from "../../middleware/validation.js"

// schema
export const createBrandVal = joi.object({
    name:generalFields.name.required()
}).required()

export const updateBrandVal = joi.object({
    name:generalFields.name,
    categoryId:generalFields.objectId.required()
})


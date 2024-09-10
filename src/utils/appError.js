
import { deleteFile } from './file.functions.js';
export class AppError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode
    }
}


// asyncHandler
export const asyncHandler = (fn)=> {
    return (req,res,next)=>{
        fn(req,res,next).catch((err)=>{
            return next(new AppError(err.message, err.statusCode) )
        })
    }
    }
    
// globalErrorHandling
export const globalErrorHandling = (err,req,res,next)=>{
    if(req.file){
       deleteFile(req.file.path)
    }
   return res.status(err.statusCode|| 500).json({
        status:err.message,
        success: false
    })
}
import { AppError } from "../../utils/appError.js"
import { status } from "../../utils/constant/enum.js"
import { messages } from "../../utils/constant/messages.js"
import {  sendEmail } from "../../utils/email.js"
import { comparPassword, hashPassword } from "../../utils/password.js"
import { generateToken, verifyToken } from "../../utils/token.js"
import { Cart } from "../cart/cart.model.js"
import { User } from "../user/user.model.js"

export const signup = async(req,res,next)=>{
    // get data from req
    const {userName,phone,email,password,DOB,role}=req.body
    // check exist
    const userExist=await User.findOne({$or:[{email},{phone}]})
    if(userExist){
        return next (new AppError(messages.user.alreadyExist,409))
        
    }
    // prepare data
    // hash pass
    const hashedPassword =  hashPassword({ password });
// ...
// create user
const newUser = new User({
  userName,
  phone,
  email,
  password: hashedPassword,
  DOB,
  role
});
// create token
const token = generateToken({ payload: { email } });
console.log("Generated Token:", token);
// send email
await sendEmail({
  to: email,
  subject: "verify",
  html:`<p>welcome to verify your account click here 
  <a href='${req.protocol}://${req.headers.host}/auth/verify?token=${token}'>link</a>
  </p>`,
})
// add db
const createdUser = await newUser.save();
if(!createdUser){
    return next(new AppError(messages.user.failToCreate,500))
}
    // send response
    return res.status(200).json({ message:messages.user.successCreate,
       success:true,
        data:createdUser})
}



export const verifyAccount = async (req, res, next) => {
    const { token } = req.query;

    try {
        const { payload } = verifyToken(token); 
        const { email } = payload; 

        

      
        const updatedUser = await User.findOneAndUpdate(
            { email, status: status.PENDING },
            { status: status.VERIFIED },
            { new: true }
           
            
        );
    //  create cart to user
await Cart.create({updatedUser:updatedUser._id})



        if (!updatedUser) {
            return next(new AppError("User not found or already verified", 404));
        }

        return res.status(200).json({
            message: messages.user.verifiedSuccessfully,
            success: true
        });
    } catch (error) {
        console.error("Token Verification Error:", error.message); 
        return next(new AppError("Verification failed: " + error.message, 500)); 
    }
};




export const login = async (req, res, next) => {
    // get data from req
    const { email, password, phone } = req.body;

    // check exist
    const userExist = await User.findOne({ $or: [{ email }, { phone }], status: status.VERIFIED });
    if (!userExist) {
        return next(new AppError('invalid credentials', 401));
    }

    // check password
    const isMatch = comparPassword({ password, hashPassword: userExist.password });

    if (!isMatch) {
        return next(new AppError('invalid credentials', 401));
    }

    // Check if the user is inactive 
    if (!userExist.active) {
        userExist.active = true;
        await userExist.save();
    }

    // create token
    // const token = generateToken({ payload: { email, active: userExist.active },secretKey: process.env.SECRET_KEY_ACCESS_TOKEN});

// create token
const token = generateToken({ email, active: userExist.active });

    return res.status(200).json({
        message: 'Login successfully',
        success: true,
        accessToken: token
    });
};




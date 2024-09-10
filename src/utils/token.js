import jwt from "jsonwebtoken"


// export const generateToken = (payload, secretKey = 'Secret') => {
//     return jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Optionally add expiry
// };


// export const verifyToken = (token, secretKey = "Secret") => {
//     try {
//         return jwt.verify(token, secretKey);
//     } catch (error) {
//         return {message:error.message}
//     }
// };



// Token generation
export const generateToken = (payload, secretKey = process.env.SECRET_KEY_ACCESS_TOKEN) => {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};


export const verifyToken = (token, secretKey = process.env.SECRET_KEY_ACCESS_TOKEN ) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return { message: error.message };
    }
};




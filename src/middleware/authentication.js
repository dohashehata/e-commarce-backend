import { User } from "../modules/user/user.model.js"
import { AppError } from "../utils/appError.js"
import { status } from "../utils/constant/enum.js"
import { messages } from "../utils/constant/messages.js"
import { verifyToken } from "../utils/token.js"

export const isAuthenticated = () => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;

            if (!authorization) {
                return next(new AppError('Authorization header is missing', 401));
            }

            const [bearer, token] = authorization.split(' ');

            if (!token || (bearer !== 'access-token' && bearer !== 'restPassword')) {
                return next(new AppError('Invalid token format', 401));
            }

            let result;
            if (bearer === 'access-token') {
                result = verifyToken(token, process.env.SECRET_KEY_ACCESS_TOKEN);
            } else if (bearer === 'restPassword') {
                result = verifyToken(token, process.env.SECRET_KEY_REST_PASSWORD);
            }

            if (result.message) {
                return next(new AppError(result.message, 401)); // Token verification error
            }

            // Log token payload for debugging
            console.log('Token payload:', result);

            // Ensure email exists in the token payload
            if (!result.email) {
                return next(new AppError('Token does not contain an email', 400));
            }

            // Find user in the database by email
            const user = await User.findOne({ email: result.email.toLowerCase(), status: status.VERIFIED }).select('-password');

            if (!user) {
                return next(new AppError('User not found', 404));
            }

            // Attach user to request
            req.authUser = user;
            next();

        } catch (error) {
            return next(new AppError('Authentication failed: ' + error.message, 500));
        }
    };
};


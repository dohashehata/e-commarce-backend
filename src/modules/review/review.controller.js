import { AppError } from "../../utils/appError.js"
import { roles } from "../../utils/constant/enum.js"
import { messages } from "../../utils/constant/messages.js"
import { Product } from "../product/product.model.js"
import { Review } from "./review.model.js"

// add review
// add review
export const addReview = async (req, res, next) => {
    // get data from req
    const { productId, rating, comment } = req.body;
    
    // todo check if user ordered this product
    const review = new Review({
        user: req.authUser._id,
        product: productId,
        rating,
        comment
    });

    const createReview = await review.save();

    // update product rate
    const rate = await Review.find({ product: productId }).select('rating');
    
    let avgRate = rate.reduce((acc, cur) => {
        return acc += cur.rating;  // You need to access 'rating' here
    }, 0);

    avgRate = avgRate / rate.length;

    await Product.findByIdAndUpdate(productId, { rating: avgRate });
    
    return res.json({
        message: messages.review.successCreate,
        success: true,
        data: { avgRate, rating }
    });
};



// delete  review
export const deleteReview = async (req, res, next) => {
    // get data from req
    const { review } = req.params;  // Use 'review' to match the route parameter
    // check existence
    const reviewExist = await Review.findById(review);
    if (!reviewExist) {
        return next(new AppError(messages.review.notFound, 404));
    }

    // check allowed
    if (req.authUser._id.toString() != reviewExist.user.toString() && req.authUser.role != roles.ADMIN) {
        return next(new AppError(messages.review.notAllowed, 403));
    }
    // delete from db
    const deleteReview = await Review.findByIdAndDelete(review);
    if (!deleteReview) {
        return next(new AppError(messages.review.failToDelete, 500));  // Correct error message here
    } else {
        res.json({ success: true, message: messages.review.successDelete });
    }
};



// get review by ID
export const getReview = async (req, res, next) => {
    const { review } = req.params;  // get review ID from URL params
    const reviewExist = await Review.findById(review);

    if (!reviewExist) {
        return next(new AppError(messages.review.notFound, 404));
    }

    res.json({
        success: true,
        data: reviewExist,
    });
};



// update review
export const updateReview = async (req, res, next) => {
    const { review } = req.params;
    const { rating, comment } = req.body;

    // find the review
    const reviewExist = await Review.findById(review);
    if (!reviewExist) {
        return next(new AppError(messages.review.notFound, 404));
    }

    // check if user is allowed to update the review
    if (req.authUser._id.toString() !== reviewExist.user.toString() && req.authUser.role !== roles.ADMIN) {
        return next(new AppError(messages.review.notAllowed, 403));
    }

    // update the review fields
    if (rating) reviewExist.rating = rating;
    if (comment) reviewExist.comment = comment;

    // save updated review
    const updatedReview = await reviewExist.save();

    // recalculate average rating for the product
    const rate = await Review.find({ product: reviewExist.product }).select('rating');
    let avgRate = rate.reduce((acc, cur) => acc + cur.rating, 0) / rate.length;

    await Product.findByIdAndUpdate(reviewExist.product, { rating: avgRate });

    res.json({
        success: true,
        message: messages.review.successUpdate,
        data: updatedReview,
    });
};

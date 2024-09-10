import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { Product } from "../product/product.model.js"
import { Cart } from "./cart.model.js"

export const addToCart = async (req, res, next) => {
    try {
        // Get data from req
        const { productId, quantity } = req.body;
        
        // Check if product exists
        const productExist = await Product.findById(productId);
        if (!productExist) {
            return next(new AppError(messages.product.notFound, 404));
        }

        // Check product stock
        if (!productExist.inStoke(quantity)) {
            return next(new AppError(messages.product.outOfStock, 400));
        }

        let message;
        let data;

        // Check if the product already exists in the cart
        let productInCart = await Cart.findOneAndUpdate(
            { user: req.authUser._id, 'products.productId': productId },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        );

        if (productInCart) {
            message = messages.cart.successUpdate;
            data = productInCart;
        } else {
            // If product is not in the cart, add it
            const cart = await Cart.findOneAndUpdate(
                { user: req.authUser._id },
                { $push: { products: { productId, quantity } } },
                { new: true, upsert: true } // Use `upsert` to create a new cart if one doesn't exist
            );
            message = messages.cart.addSuccessfully;
            data = await Cart.findOne({ user: req.authUser._id }); // Fetch updated cart after insertion
        }

        return res.status(200).json({
            message,
            success: true,
            data,
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// deleteFromCart
export const deleteFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;

        // Find the user's cart and remove the specific product
        const cart = await Cart.findOneAndUpdate(
            { user: req.authUser._id },
            { $pull: { products: { productId } } },
            { new: true }
        );

        if (!cart) {
            return next(new AppError(messages.cart.notFound, 404));
        }

        return res.status(200).json({
            message: messages.cart.successDelete,
            success: true,
            data: cart,
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

// updateCart
export const updateCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        // Check if the product exists
        const productExist = await Product.findById(productId);
        if (!productExist) {
            return next(new AppError(messages.product.notFound, 404));
        }

        // Check product stock
        if (!productExist.inStoke(quantity)) {
            return next(new AppError(messages.product.outOfStock, 400));
        }

        // Find the cart and update the product quantity
        const cart = await Cart.findOneAndUpdate(
            { user: req.authUser._id, 'products.productId': productId },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        );

        if (!cart) {
            return next(new AppError(messages.cart.notFound, 404));
        }

        return res.status(200).json({
            message: messages.cart.successUpdate,
            success: true,
            data: cart,
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};
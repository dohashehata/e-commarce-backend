import Stripe from "stripe"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { Cart } from "../cart/cart.model.js"
import { Coupon } from "../coupon/coupon.model.js"
import { Product } from "../product/product.model.js"
import { Order } from "./order.model.js"

export const createOrder= async(req,res,next)=>{
// get data from req

const {Phone,street,paymentMethod,coupon}=req.body
// check coupon
let couponExist=0
if(coupon){
    couponExist=await Coupon.findOne({code:coupon})
    if(!couponExist){
        return next(new AppError(messages.coupon.notFound,404))
    }

}
// check cart
const cart= await Cart.findOne({user:req.authUser._id})
if(!cart){
    return next(new AppError('not Found cart',404))
}
const products=cart.products
let orderPrice = 0
let orderProducts = []
// check products
for (const product of products) {
    const productExist= await Product.findById(product.productId)
    if(!productExist){
        return next(new AppError(messages.product.notFound,404))
    }
    if(!productExist.inStoke(product.quantity)){
        return next(new AppError("out of stoke",404))
    }

    orderPrice += productExist.price * product.quantity
    // finalPrice += productExist.finalPrice * product.quantity
    orderProducts.push({
        name:productExist.name,
        productId:product.productId,
        quantity:product.quantity,
        price:productExist.price,
        finalPrice:productExist.finalPrice,
        discount:productExist.discount

    })
}

// create order
const order =new Order({
    user:req.authUser._id,
    address:{Phone,street},
    coupon:{couponId:couponExist._id,code:coupon},
    discount:couponExist.discount,
    paymentMethod,
    products:orderProducts,
    orderPrice,
    finalPrice:orderPrice-(orderPrice*(couponExist.discount|| 0)/ 100)
   

})

// add to db
const createdOrder=await order.save()

// integrate payment 
if(paymentMethod=='visa'){
    const stripe=new Stripe('pk_test_51PxCkqDhFAVpzbWP0P6O42Q4nQEwxjFnKU9hMn40SCY0PLpg8LjjbMqPm67KIym7dG5e9zUCHKTnIfOYLBcIdOjH0023zWy7Qt')

 const checkout = await  stripe.checkout.sessions.create({
success_url:"https://www.google.com",
cancel_url:"https://www.facebook.com",
payment_method_types:["card"],
mode:"payment",
line_items:createdOrder.map(product=>{
    return {
        price_data:{
            currency:"egp",
            product_data:{
                name:product.name
            },
            unit_amount:product.price*100
        },
        quantity:product.quantity
    }
})
    })

    return res.status(200).json({
        message:messages.order.successCreate,
        success:true,
        data:createdOrder,
        url:checkout.url
    })

}

return res.status(200).json({
    message:messages.order.successCreate,
    success:true,
    data:createdOrder
})

}



// Update an Order
export const updateOrder = async (req, res, next) => {
    const { orderId } = req.params;
    const { Phone, street, paymentMethod, coupon } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
        return next(new AppError(messages.order.notFound, 404));
    }

    // Update order details
    order.address.Phone = Phone || order.address.Phone;
    order.address.street = street || order.address.street;
    order.paymentMethod = paymentMethod || order.paymentMethod;

    if (coupon) {
        const couponExist = await Coupon.findOne({ code: coupon });
        if (!couponExist) {
            return next(new AppError(messages.coupon.notFound, 404));
        }
        order.coupon = { couponId: couponExist._id, code: coupon };
        order.discount = couponExist.discount;
        order.finalPrice = order.orderPrice - (order.orderPrice * (couponExist.discount || 0) / 100);
    }

    await order.save();

    res.status(200).json({
        message: messages.order.successUpdate,
        success: true,
        data: order
    });
};

// Delete an Order
export const deleteOrder = async (req, res, next) => {
    const { orderId } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
        return next(new AppError(messages.order.notFound, 404));
    }

    res.status(200).json({
        message: messages.order.successDelete,
        success: true
    });
};
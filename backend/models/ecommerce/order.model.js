import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    } 
});

const addressSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zip: {
        type: Number,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
})

const orderSchema = new mongoose.Schema({
    orderPrice: {
        type: Number,
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderItems: {
        type: [orderItemSchema],
        required: true,
    },
    address: {
        type: [addressSchema],
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Cancelled', 'Processing', 'Shipped', 'Delivered'],
        default: 'Pending',
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending',
    },
    phone: {
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;
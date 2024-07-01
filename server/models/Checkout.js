const mongoose = require("mongoose");
const checkoutSchema = new mongoose.Schema({
    totalQty: {
        type: Number,
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    },
    items: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            qty: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            imagePath: {
                type: String,
                required: true
            },
            productCode: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model("Checkout", checkoutSchema);
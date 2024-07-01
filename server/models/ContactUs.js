const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true
    },
    phone: {
        type: Number,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model("ContactUs", contactSchema);

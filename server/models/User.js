const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;

const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: Number,
        required: false,
        default: null,
    },
    gender: {
        type: String,
        required: false,
        default: null,
    },
    dob: {
        type: String,
        required: false,
        default: null,
    },
    location: {
        type: String,
        required: false,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isUser: {
        type: Boolean,
        default: false
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    wishlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wishlist'
    }],
    carts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    }]
},
{
    timestamps: true
});

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

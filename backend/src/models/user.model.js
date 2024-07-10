import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
    },
    fullName: {
        type: String,
        required: [true, "Please provide a name"],
        trim: true,
        index: true
    },
    avatar: {
        type: String, //cloudinary url
        trim: true,
        required: true
    },
    coverImage: {
        type: String, //cloudinary url
        trim: true,
        required: false
    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: "Video",
    },
    refreshToken: {
        type: String,
    }
}, {timestamps: true});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.isPasswordMatched = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
    return await jwt.sign(
        {  _id: this._id,
            email: this.email, 
            username: this.username }, 
            process.env.ACCESS_TOKEN_SECRET, 
        {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
};

userSchema.methods.generateRefreshToken = async function () {
    return await jwt.sign(
        {  _id: this._id }, 
            process.env.REFRESH_TOKEN_SECRET, 
        {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
};

export const User = mongoose.model("User", userSchema);

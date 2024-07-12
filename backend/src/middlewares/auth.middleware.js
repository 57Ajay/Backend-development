import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";

export const verify = asyncHandler(async (req, _, next) => {
    try {
        let token;

        if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        console.log('Extracted token:', token);

        if (!token) {
            throw new apiError("Please login first", 401);
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log('Decoded token:', decodedToken);

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if (!user) {
            throw new apiError("User not found", 404);
        }

        req.user = user;
        next();
    } catch (error) {
        console.log('Error during token verification:', error);
        throw new apiError(error.message || "Invalid access token", 401);
    }
});

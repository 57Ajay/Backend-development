// this will authenticate if the user exists or not

import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler,js";

import { User } from "../models/user.model";

export const verify = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header(
            "Authorization"?.replace("Bearer ", "")
        );
        if (!token){
            throw new apiError("Please login first", 401);
        };
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._Id).select("-password -refreshToken");
        if(!user){
            throw new apiError("User not found", 404);
        };
        req.user = user;
        next();
    } catch (error) {
        throw new apiError(error?.message || "Invalid access Token", 401);
    };
    
});
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler( async (req, res)=>{

    // get userDetails, validation, and does he alreadyExists or not like by userName & email,
    // check for images, avatar
    // upload them to cloudinary, avatar
    // create user object -create entry in db
    // remove password and refresh token from response
    // check for user creation, if created return res else send error

     const {username, email, password, fullName} = req.body
     console.log(req.body)
     if (
        [fullName, username, email, password].some((field) => field?.trim() ==="")
     ){
        throw new apiError('Please provide all values', 400)
     }
     const doesUserExist = await User.findOne({$or:[{ username }, { email }]})
     if (doesUserExist){
        throw new apiError('User already exists', 409)
     };
     const avatarLocalPath = req.files?.avatar[0]?.path;
     const coverImageLocalPath = req.files?.coverImage[0]?.path;
     console.log(req.files)
     if (!avatarLocalPath){
        throw new apiError('Please upload an avatar and cover image', 400)
     };
     // upload them to cloudinary using cloudinary.js

     const avatar = await uploadOnCloudinary(avatarLocalPath, 'avatar');
     const coverImage = await uploadOnCloudinary(coverImageLocalPath, 'coverImage');
     if (!avatar){
        throw new apiError('Failed to upload avatar', 500)
     };
     const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        email,
        password,
     })

     const createdUser = await User.findById(user._id).select('-password -refreshToken')
     res.status(201).json({
        status: 'success',
        data: createdUser,
        token: createdUser.createJWT()
     });
     if (!createdUser){
        throw new apiError('Something went wrong', 500)
     };
     return res.status(201).json(
        apiResponse(200, createdUser, 'User created successfully')
     )
});

export {
    registerUser
}

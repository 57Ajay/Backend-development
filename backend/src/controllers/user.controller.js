import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { apiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshToken = async(userID)=>{
   try {

      const user = await User.findById(userID);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return {accessToken, refreshToken};

   } catch (error) {
      throw new apiError("SOmething went wrong", 500)
   };
};



const registerUser = asyncHandler( async (req, res)=>{
   // ----------|------------Steps needed to be followed -----------|-----------
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
    //  const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    };

     console.log('Files: ',req.files)
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
        username: username,
        email,
        password,
     })

     const createdUser = await User.findById(user._id).select('-password -refreshToken')
     res.status(201).json({
        status: 'success',
        data: createdUser,
     });
     if (!createdUser){
        throw new apiError('Something went wrong', 500)
     };
     return res.status(201).json(
        new apiResponse(200, createdUser, 'User created successfully')
     )
});

const loginUser = asyncHandler( async (req, res)=>{
   // req.body -> Data
   // username or email
   // find the user
   // password and check
   // access and refresh token
   // send these tokens in secure cookies
   // send a response that done successfully
   const {username, password, email} = req.body
   if (!username || !password || !email){
    throw new apiError('Please provide username, password and email', 400)
}
   const user = await User.findOne({$or:[{ username }, { email }]});
   if (!user){
      throw new apiError("User not found", 404)
   };
   const passwordMatched = await user.isPasswordMatched(password);
   if (!passwordMatched){
      throw new apiError("Invalid credentials", 401)
   };
   const { accessToken, refreshToken  } = await generateAccessAndRefreshToken(user._id);
   const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

   return res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
   }).cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
   }).json(
      new apiResponse(200, {
         accessToken,
         refreshToken,
         user: loggedInUser},
         'User logged in successfully'),
   );

}); 

const logoutUser = asyncHandler( async (req, res)=>{
   await User.findByIdAndUpdate(req.user._id,
      { $set:{
         refreshToken: undefined}
      },
      { new: true });

      return res.status(200).clearCookie('accessToken').clearCookie('refreshToken').json(
         new apiResponse(200, {}, 'User logged out successfully')
      );
});

 

export {
    registerUser,
    loginUser,
    logoutUser,
}

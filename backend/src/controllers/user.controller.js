import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async(userId)=>{
   try {

      const user = await User.findById(userId);
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

const loginUser = asyncHandler(async (req, res) => {
   const { username, password, email } = req.body;
   if (!username || (!password && !email)) {
       throw new apiError('Please provide username, password, and email', 400);
   }

   const user = await User.findOne({ $or: [{ username }, { email }] });
   if (!user) {
       throw new apiError("User not found", 404);
   }

   const passwordMatched = await user.isPasswordMatched(password);
   if (!passwordMatched) {
       throw new apiError("Invalid credentials", 401);
   }

   const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
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
           user: loggedInUser
       }, 'User logged in successfully')
   );
});


const logoutUser = asyncHandler(async (req, res) => {
   const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
   console.log('Token before logout:', token);

   if (!token) {
       throw new apiError("Please login first", 401);
   }

   const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
   console.log('Decoded token during logout:', decodedToken);

   await User.findByIdAndUpdate(decodedToken._id, { $set: { refreshToken: undefined } }, { new: true });

   return res.status(200).clearCookie('accessToken').clearCookie('refreshToken').json(
       new apiResponse(200, {}, 'User logged out successfully')
   );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
   const incomingRefreshToken =req.cookies.refreshToken || req.body.refreshToken;
   if (!incomingRefreshToken) {
       throw new apiError("Please login first", 401);
   };

   try {
      const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findById(decodedToken._id).select('-password -refreshToken');
      if (!user){
         throw new apiError("Invalid Token", 404);
      };
      if (incomingRefreshToken !== user.refreshToken) {
          throw new apiError("Refresh Tokens did not match", 401);
      };
      await generateAccessAndRefreshToken(user._id);
   
      return res.status(200).cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: true,
      }).cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
      }).json(
         new apiResponse(200, { accessToken, refreshToken: newRefreshToken }, 'Access token refreshed successfully')
      );
   } catch (error) {
      throw new apiError(error?.message|| "Invalid refresh Token", 401);
   };


});

const changeCurrentPassword = asyncHandler(async (req, res)=>{
   const { currentPassword, newPassword } = req.body;
   if (!currentPassword || !newPassword) {
       throw new apiError("Please provide current password and new password", 400);
   };
   if (currentPassword === newPassword) {
       throw new apiError("New password cannot be same as current password", 400);
   };
   const user = await User.findById(req.user._id);
   const isPasswordCorrect = await user.isPasswordMatched(currentPassword);
   if(!isPasswordCorrect){
      throw new apiError("Current password is incorrect", 401);
   };
   user.password = newPassword;
   await user.save({ validateBeforeSave: false });
   return res.status(200).json(
      new apiResponse(200, {}, 'Password changed successfully')
   )
});

const getCurrentUser = asyncHandler(async (req, res)=>{
   return res.status(200).json(
      new apiResponse(200, req.user, 'User fetched successfully')
   );
});

const updateAccountDetails = asyncHandler(async (req, res)=>{
   const { fullName, email } = req.body;
   if (!fullName || !email) {
       throw new apiError("Please provide fullName, email, and username", 400);
   };
   const user = await User.findByIdAndUpdate(req.user?._id, {
      $set: {
         fullName,
         email,
      }
   }, { new: true }).select('-password');

   return res.status(200).json(
      new apiResponse(200, user, 'Account details updated successfully')
   );
});

const updateUserAvatar = asyncHandler(async (req, res)=>{
   const avatarLocalPath = req.file?.path;
   if (!avatarLocalPath) {
       throw new apiError("Please upload an avatar first", 400);
   };
   const avatar = await uploadOnCloudinary(avatarLocalPath, 'avatar');
   if (!avatar) {
       throw new apiError("Failed to upload avatar", 500);
   };
   if (!avatar.url) {
       throw new apiError("Failed to upload avatar", 500);
   };
   const updatedUser = await User.findByIdAndUpdate(req.user?._id, {
      $set: {
         avatar: avatar.url,
      }
   }, { new: true }).select('-password');

   return res.status(200).json(
      new apiResponse(200, updatedUser, 'Avatar updated successfully')
   );
});

const updateUserCoverAvatar = asyncHandler(async (req, res)=>{
   const coverImageLocalPath = req.file?.path;
   if (!coverImageLocalPath) {
       throw new apiError("Please upload an avatar first", 400);
   };
   const coverImage = await uploadOnCloudinary(coverImageLocalPath, 'coverImage');
   if (!coverImage) {
       throw new apiError("Failed to upload coverImage", 500);
   };
   if (!coverImage.url) {
       throw new apiError("Failed to upload avatar", 500);
   };
   const updatedUser = await User.findByIdAndUpdate(req.user?._id, {
      $set: {
         coverImage: coverImage.url,
      }
   }, { new: true }).select('-password');

   return res.status(200).json(
      new apiResponse(200, updatedUser, 'coverImage updated successfully')
   );
});

const getUserChannelProfile = asyncHandler(async(req, res)=>{
   const { username } = req.params;
   if(!username?.trim()){
      throw new apiError("Please provide username", 400);
   };
   const channel = await User.aggregate([
      {
         $match: {
            username: username?.toLowerCase()
         }
      },
      {
         $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribers"
         }
      },
         {
            $lookup: {
               from: "subscriptions",
               localField: "_id",
               foreignField: "subscriber",
               as: "subscribedTo"
            }
         },
         {
            $addFields: {
               subscribersCount: {
                  $size: "$subscribers"
               },
               channelsSubscribedToCount: {
                  $size: "$subscribedTo"
               },
               isSubscribed: {
                  $cond: {
                     if: {
                        $in: [req.user?._id, "$subscribers.subscriber"]
                     },
                     then: true,
                     else: false
                  }
               }
            }
         },
         {
            $project: {
               fullName: 1,
               username: 1,
               subscribersCount: 1,
               channelsSubscribedToCount: 1,
               isSubscribed: 1,
               avatar: 1,
               coverImage: 1,
               email: 1
            }
         }
   ]);
   console.log(channel);
   if(!channel?.length){
      throw new apiError("Channel not found", 404);
   };
   return res.status(200).json(
      new apiResponse(200, channel[0], 'Channel fetched successfully')
   );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverAvatar,
    getUserChannelProfile
}

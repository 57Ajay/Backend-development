import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser, logoutUser, refreshAccessToken, registerUser, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverAvatar, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import { verify } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

userRouter.route("/login").post(loginUser);

userRouter.route("/logout").post(verify, logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/change-password").post(verify, changeCurrentPassword);
userRouter.route("/current-user").get(verify, getCurrentUser);
userRouter.route("/update-account-details").patch(verify, updateAccountDetails);
userRouter.route("/update-avatar").patch(verify, upload.single("avatar"), updateUserAvatar);
userRouter.route("/update-cover-image").patch(verify, upload.single("coverImage"), updateUserCoverAvatar);
userRouter.route("/c/:username").get(verify, getUserChannelProfile);
userRouter.route("/watch-history").get(verify, getWatchHistory)


export default userRouter;

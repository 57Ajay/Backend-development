import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
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
userRouter.route("/refresh-token").post(refreshAccessToken)

export default userRouter;

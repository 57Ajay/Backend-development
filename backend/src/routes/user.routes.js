// src/routes/user.routes.js
import express from "express";
import { upload } from "../middlewares/multer.middleware.js"
import {loginUser, logoutUser, registerUser} from "../controllers/user.controller.js"// Corrected import path
import { verify } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    registerUser);

userRouter.route("/login").post(
    loginUser
);
userRouter.route("/logout").post(
   verify, logoutUser
);


export default userRouter;

// src/routes/user.routes.js
import express from "express";
import { upload } from "../middlewares/multer.middleware.js"
import {registerUser} from "../controllers/user.controller.js"// Corrected import path

const userRouter = express.Router();

userRouter.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    registerUser);

export default userRouter;

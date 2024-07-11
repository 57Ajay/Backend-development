// src/routes/user.routes.js
import express from "express";
import {registerUser} from "../controllers/user.controller.js"// Corrected import path

const userRouter = express.Router();

userRouter.route("/register").post(registerUser);

export default userRouter;

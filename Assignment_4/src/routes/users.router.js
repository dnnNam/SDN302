import express from "express";

import { getUserInfo, loginUser, registerUser } from "../controllers/user.controllers.js";
import { verifyAdmin, verifyUser } from "../middlewares/authenticate.js";


const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/",verifyUser, verifyAdmin, getUserInfo);

export default userRouter;
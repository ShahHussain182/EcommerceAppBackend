import express from "express";
import { login, logout, refresh, signup, verifyEmail } from "../Controllers/auth.controller.js";
const authRouter = express.Router();


authRouter.post("/signup",signup )

authRouter.post("/verify-email",verifyEmail);
authRouter.post("/login", login);
authRouter.post("/logout",logout);
authRouter.get("/refresh", refresh);



 
export default authRouter;
import express from "express";
import {startKaKaoLogin,finishKaKaoLogin,getEdit,postEdit,getChangePassword,postChangePassword,myProfile,logout} from "../controllers/userController";
import {protectMiddleware, publiOnlyMiddleware,avatarUpload} from "../middlewares";
const userRouter = express.Router();

const handleUser = (req, res)=> res.send("user");

userRouter.get("/", handleUser);
userRouter.get("/:id(\[0-9a-f]{24})", myProfile);
userRouter.route("/edit").all(protectMiddleware).get(getEdit).post(avatarUpload.single("avatar"),postEdit);
userRouter.get("/github/start", publiOnlyMiddleware, startKaKaoLogin);
userRouter.get("/github/callback", publiOnlyMiddleware, finishKaKaoLogin);
userRouter.route("/change-password").all(protectMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/logout", protectMiddleware, logout);

export default userRouter;
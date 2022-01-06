import express from "express";
import {home, getSearch, postSearch} from "../controllers/videoController";
import {getJoin,postJoin ,getLogin, postLogin} from "../controllers/userController";
import {publiOnlyMiddleware} from "../middlewares";
const globalRouter = express.Router();//라우터 만듬




globalRouter.get("/", home);
globalRouter.route("/join").all(publiOnlyMiddleware).get(getJoin).post(postJoin);
globalRouter.route("/login").all(publiOnlyMiddleware).get(getLogin).post(postLogin);
globalRouter.route("/search").get(getSearch).post(postSearch);



export default globalRouter;
import "dotenv/config";
import "./db";
import session from "express-session";
import express from "express";
import MongoStore from "connect-mongo";
import logger from "morgan";
import { localsMiddleware } from "./middlewares";
import globalRouter from "./routes/globalRouter";
import videoRouter from "./routes/videoRouter";
import userRouter from "./routes/userRouter";

const app = express();

app.set("views", process.cwd() + '/src/views');
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true })) 
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({mongoUrl: process.env.DB_URL}),
}))
app.use("/uploads", express.static("uploads"))
app.use("/assets", express.static("assets"))
app.use(localsMiddleware)
app.use("/", globalRouter);//라우터 실제로 쓰는 법 어플리케이션 준비
app.use("/users", userRouter);
app.use("/videos", videoRouter);


app.use(logger("dev"));
app.listen(3000, ()=> console.log("server listenting on port 3000"));


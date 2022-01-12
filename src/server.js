import "dotenv/config";
import "./db";
import session from "express-session";
import express from "express";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import logger from "morgan";
import { localsMiddleware } from "./middlewares";
import globalRouter from "./routes/globalRouter";
import videoRouter from "./routes/videoRouter";
import userRouter from "./routes/userRouter";
import apiRouter from "./routes/apiRouter";

const app = express();

app.set("views", process.cwd() + '/src/views');
app.set("view engine", "pug");
app.use(flash());
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({mongoUrl: process.env.DB_URL}),
}))
app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
    });
app.use("/uploads", express.static("uploads"))
app.use("/assets", express.static("assets"))
app.use(localsMiddleware)
app.use("/", globalRouter);//라우터 실제로 쓰는 법 어플리케이션 준비
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);


app.listen(3000, ()=> console.log("server listenting on port 3000"));


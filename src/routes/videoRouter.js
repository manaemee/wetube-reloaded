import express from "express";
import {
    see,
    getUpload,
    postUpload,
    getEdit,
    postEdit,
    remove
} from "../controllers/videoController";
import {protectMiddleware, videoUpload} from "../middlewares";
const videoRouter = express.Router();

videoRouter.get("/:id(\[0-9a-f]{24})", see);
videoRouter
.route("/upload")
.all(protectMiddleware)
.get(getUpload)
.post(videoUpload.single("video"), postUpload);

videoRouter.route("/:id(\[0-9a-f]{24})/edit").all(protectMiddleware).get(getEdit).post(postEdit);
videoRouter.get("/:id(\[0-9a-f]{24})/remove", protectMiddleware, remove);

export default videoRouter;
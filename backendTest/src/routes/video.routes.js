import {Router} from "express"
import { 
    deleteVideo,
     getAllVideos,
      getVideoById,
       publishAVideo,
        togglePublishStatus, 
        updatedVideo } from "../controllers/video.controllers.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import {upload} from "../middlewares/multer.middlewares.js"

const router = Router();

 // router.use(verifyJWT); // apply verify

router
    .route("/")
    .get(getAllVideos)
    .post(
        verifyJWT,
    upload.fields([
        {
            name : "videoFile",
            maxCount : 1,
        },
        {
            name : "thumbnail",
            maxCount : 1,
        },
    ]),
    publishAVideo
);

router.route("/v/:videoId")
.get(verifyJWT, getVideoById)
.delete( verifyJWT, deleteVideo)
.patch( verifyJWT , upload.single("thumbnail"), updatedVideo);

router.route("/toggle/publish/:videoId").patch(verifyJWT ,togglePublishStatus);

export default router
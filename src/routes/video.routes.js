import { Router } from 'express';
import {
    deleteVideo,
    searchVideo,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    videoRecomendations,
    increaseVideoViews,
    getWatchHistory
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file
router.route("/recomendations/:count").get(videoRecomendations)
router.route("/increaseViews/:videoId").post( verifyJWT , increaseVideoViews)
router.route("/updateVideo/:videoId").patch(verifyJWT , upload.single("thumbnail") , updateVideo)
router.route("/searchResult").post(searchVideo)
router.route("/getWatchHistory/:userId").post(getWatchHistory)

router
    .route("/")
    .get()
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(verifyJWT ,deleteVideo)

router.route("/toggle/publish/:videoId").patch(verifyJWT ,togglePublishStatus);

export default router
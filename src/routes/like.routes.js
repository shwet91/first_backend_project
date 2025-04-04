import { Router } from "express"
import {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    checkForLiked
} from "../controllers/like.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router()

router.route("/toggleLikeVideo/:videoId").post( verifyJWT , toggleVideoLike )
router.route("/checkForLiked/:videoId").post( verifyJWT , checkForLiked )


export default router
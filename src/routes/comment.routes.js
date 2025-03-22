import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    } from "../controllers/comment.controller.js"

const router = Router()

router.route("/addComment").post( verifyJWT , addComment )


router.route("/getComments/:videoId").get(getVideoComments)
router.route("/updateComment").post(updateComment)
router.route("/deleteComment").post(deleteComment)


export default router
import { Router } from "express";
import {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    } from "../controllers/comment.controller.js"

const router = Router()

router.route("/addComment").post( addComment )


router.route("/getComment").get(getVideoComments)
router.route("/updateComment").post(updateComment)
router.route("/deleteComment").post(deleteComment)


export default router
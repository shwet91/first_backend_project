import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/dashboard.controller.js"
import { addDummyData } from '../controllers/sample.controller.js';
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/stats/:userId").get(getChannelStats);
router.route("/videos/:channelId").get(getChannelVideos);
router.route("/addData").post(addDummyData)

export default router
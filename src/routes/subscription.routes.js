import { Router } from "express";
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = Router()
router.route("/toggleSubscription/:channelId").post( verifyJWT , toggleSubscription);
router.route("/getUserChannelSubscribers/:channelId").post( getUserChannelSubscribers)
router.route("/getSubscribedChannels").get(getSubscribedChannels)

export default router
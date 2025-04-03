import {Router} from "express";
import {upload} from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {print , operation , addDummyData , assignment} from "../controllers/sample.controller.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getAnyUser
    } from "../controllers/user.controller.js"



const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
registerUser
)

router.route("/login").post(loginUser)
router.route("/getAnyUser/:userId").get(getAnyUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshToken)

// sample routes
router.route("/sample").post(print)
router.route("/operation").post(operation)
router.route("/addDummyData").post(addDummyData)
router.route("/assignment").post(assignment)

//**** */


router.route("/changeCurrentPassword").post(verifyJWT,changeCurrentPassword)
router.route("/getCurrentUser").get(verifyJWT,getCurrentUser)
router.route("/updateAccountDetails").post(verifyJWT,updateAccountDetails)
router.route("/updateUserAvatar").post( verifyJWT,
    
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]), 
    
    updateUserAvatar)
router.route("/updateUserCoverImage").post(verifyJWT,
    
    upload.fields([
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),

    updateUserCoverImage)
router.route("/getUserChannelProfile/:username").post(getUserChannelProfile)


export default router
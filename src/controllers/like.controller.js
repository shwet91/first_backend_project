import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    if(!videoId){
        throw new ApiError(400 , "please provide the video Id")
    }

    const LikeDocument = await Like.create({
        video : videoId
    })

    const createdLike = await Like.findById(LikeDocument._id)

    if(!createdLike){
        throw new ApiError(500 , "failed to create like document")
    }

    return res.status(200).json( new ApiResponse( 200 , createdLike , "video Liked successfully" ))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    if(!commentId){
        throw new ApiError(400 , "please provide the comment Id")
    }

    const LikeDocument = await Like.create({
        comment : commentId
    })

    const createdLike = await Like.findById(LikeDocument._id)

    if(!createdLike){
        throw new ApiError(500 , "failed to create like document")
    }

    return res.status(200).json( new ApiResponse( 200 , createdLike , "comment Liked successfully" ))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    if(!tweetId){
        throw new ApiError(400 , "please provide the tweet Id")
    }

    const LikeDocument = await Like.create({
        tweet : tweetId
    })

    const createdLike = await Like.findById(LikeDocument._id)

    if(!createdLike){
        throw new ApiError(500 , "failed to create like document")
    }

    return res.status(200).json( new ApiResponse( 200 , createdLike , "tweet Liked successfully" ))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    let videoCollection = []

    const likedVideoDocuments = await Like.aggregate([
        {
            $match: {owner : req.user._id}
        },
        {
            $project : {
                video : 1 ,
                _id : 0
            }
        }
    ])

    likedVideoDocuments.map( async (e , i) => {
        const foundVideo = await Video.findById(e)
        videoCollection.push(foundVideo)
    })

    return res.status(200).json( new ApiResponse (200 , videoCollection , "Liked Video Loaded successfully"))

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
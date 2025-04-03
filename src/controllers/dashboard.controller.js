import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const { userId } = req.params 
        if(!userId){
            throw new ApiError(400 , "provide channelId")
        } 

        const videos = await Video.aggregate([
            {
                $match : {owner : new mongoose.Types.ObjectId(userId)}
            },
            {
                $group : {
                    _id : null ,
                    totalViews : { $sum : "$views" },
                    totalLikes : { $sum : "$likes" },
                    totalVideos : { $sum : 1  }
                }
            }
        ])

        const subscribers = await Subscription.aggregate([
            {
                $match : {channel : new mongoose.Types.ObjectId(userId)}
            },
            {
                $group : {
                    _id : null ,
                    totalSubscribers : { $sum : 1  }
                }
            }
        ])

        const data = {
            totalViews : videos[0]?.totalViews ,
            totalVideos : videos[0]?.totalVideos ,
            totalSubscribers : subscribers[0]?.totalSubscribers ,
            totalLikes : videos[0]?.totalLikes
        }

        return res.status(200).json( new ApiResponse(200 , data , "stats recived "))

    
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const { channelId } = req.params 
        if(!channelId){
            throw new ApiError(400 , "provide channelId")
        }

        const videos = await Video.find({ owner : channelId })

        if(!videos){
            throw new ApiError(400 , "failed to get videos")
        }
        if(videos.length === 0){
            throw new ApiError(400 , "No videos found")
        }

        return res.status(200).json( new ApiResponse(200 , videos , "videos riceved"))
    
})

export {
    getChannelStats, 
    getChannelVideos
    }
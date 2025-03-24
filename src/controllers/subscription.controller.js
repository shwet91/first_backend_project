import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

    if(!channelId ){
        throw new ApiError(400 , "Please provide chanel Id")
    }
    if(!req.user?._id ){
        throw new ApiError(400 , "unauthorized request")
    }

    const subscription = await Subscription.create({
        channel : channelId,
        subscriber : req.user._id
    })

    const createdSubscription = await Subscription.findById(subscription._id)
    if(!createdSubscription){
        throw new ApiError(500 , "failed to create subscription document")
    }

    return res.status(200).json( new ApiResponse(200 , createdSubscription , "channel subscribed"))

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!req.user?._id ){
        throw new ApiError(400 , "unauthorized request")
    }

    const subscribers = await Subscription.aggregate([
        {
            $match : { channel : req.user._id }
        },
        {
            $project : {
                _id : 0,
                subscriber : 1
            }
        }
    ])

    if(!subscribers){
        throw new ApiError(500 , "failed to get subscribers")
    }
    if(subscribers.length === 0){
        throw new ApiError(400 , "No subscribers")
    }

    return res.status(200).json( new ApiResponse( 20, subscribers , "subscribers listed"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params


    if(!req.user?._id ){
        throw new ApiError(400 , "unauthorized request")
    }

    const channels = await Subscription.aggregate([
        {
            $match : { subscriber : req.user._id }
        },
        {
            $project : {
                _id : 0,
                channel : 1
            }
        }
    ])

    if(!channels){
        throw new ApiError(500 , "failed to get subscribers")
    }
    if(channels.length === 0){
        throw new ApiError(400 , "No subscribers")
    }

    return res.status(200).json( new ApiResponse( 20, channels , "subscribers listed"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
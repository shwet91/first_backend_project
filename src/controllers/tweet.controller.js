import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const { content } = req.body 
    if(!content) {
        throw new ApiError(400 , "please provide the content")
    }

    if(!req.user?._id){
        throw new ApiError(400 , "unauthorized request")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })

    const createdTweet = await Tweet.findById(tweet._id)
    if(!createTweet){
        throw new ApiError(500 , "failed to create tweet document")
    }

    return res.status(200).json( new ApiResponse( 200 , createdTweet , "tweet created" ) )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params 
    if(!userId){
        throw new ApiError(400 , "please provide userId")
    }

    const tweets = await Tweet.find({owner : userId})
    if(!tweets){
        throw new ApiError(400 , "failed to get tweets")
    }

    if(tweets.length === 0){
        throw new ApiError(400 , "No tweets available")
    }

    return res.status(200).json( new ApiResponse(200 , tweets , "tweet received"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId , content } = req.body
    if(!tweetId || !content ){
        throw new ApiError(400 , "Please provide tweetId or Content")
    }

    const tweet = await Tweet.findByIdAndUpdate( tweetId , {
        content
    }, {new : true , validators : true} )

    if(!tweet){
        throw new ApiError(400 , "failed to find tweet from database")
    }

    return res.status(200).ApiResponse(new ApiResponse(200 , tweet , "tweet updated"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const { tweetId } = req.params
    if(!tweetId || !content ){
        throw new ApiError(400 , "Please provide tweetId or Content")
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId)
    if(!tweet){
        throw new ApiError(400 , "tweet not found")
    }

    return res.status(200).json( new ApiResponse(200 , tweet , "tweet deleted"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}

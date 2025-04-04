import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const searchVideo = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType = "asc", userId } = req.body
    //TODO: get all videos based on query, sort, pagination
    console.log(req.body)
    if(!query){
        throw new ApiError(400 , "please provide the query")
    }

    if(!sortBy || !sortType){
        throw new ApiError(400 , "please provide sort by or sort type")
    }

    if(sortType !== "asc" && sortType !== "desc" ){
        throw new ApiError( 400 , "please provide proper value of sort type")
    }

    const sortOrder = sortType === "asc" ? 1 : -1 ;

    const skip = Number((page - 1) * limit);
    // const videos = await Video.find({ title : { $regex : query , $options : "i"} }).skip(skip).limit(limit).sort({ [sortBy] : sortOrder})
    
    const videos = await Video.find( userId ? { owner : userId , title : { $regex : query , $options : "i"} } : { title : { $regex : query , $options : "i"} } )
    .skip(skip)
    .limit(Number(limit))
    .sort({ [sortBy] : sortOrder})
   
    if(videos.length === 0 ){
        return res.status(200).json( new ApiResponse(200 , videos , " No video found "))
    }
    return res.status(200).json( new ApiResponse(200 , videos , "video search success"))

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description , duration} = req.body
    // TODO: get video, upload to cloudinary, create video
    // console.log(req.body)

    if( !req.user?._id){
        throw new ApiError( 400 , "unauthorized request...login first to upload video")
    }

    if(!title || !description){
        throw new ApiError(400 , "pleas provide title or description")
    }

    const videoFilePath = req.files?.videoFile[0]?.path 
    const thumbnailPath = req.files?.thumbnail?.[0]?.path 

    let videoFile = ""

    if(videoFilePath){
         videoFile = await uploadOnCloudinary(videoFilePath);
        if( !videoFile.url ){
            throw new ApiError("failed to upload video File on cloudinary")
        }
    }
    
    let thumbnail = ""

    if(thumbnailPath){
        thumbnail = await uploadOnCloudinary(thumbnailPath);
        if( !thumbnail.url ){
            throw new ApiError("failed to upload video File on cloudinary")
        }
    }

    // console.log(title , description , duration)


    const video = await Video.create({
        title,
        description,
        duration,
        videoFile : videoFile.url,
        thumbnail : thumbnail.url,
        views : 0,
        isPublished : true,
        owner : req.user._id

    })

    const createdVideo = await Video.findById(video._id)
    if(!createdVideo){
        throw new ApiError("failed to create video document")
    }

    return res.status(200).json( new ApiResponse(200 , createdVideo , "successful"))


})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if(!videoId){
        throw new ApiError(400 , "please provide video ID")
    }

    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(500 , "failed to find video from data base")
    }

    return res.status(200)
              .json( new ApiResponse(200 , video , "ok"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title , description } = req.body;
    //TODO: update video details like title, description, thumbnail
  
    if(!videoId){
        throw new ApiError(40 , "provide videoId")
    }

    const video = await Video.findById(videoId)
    if( !video ){
        throw new ApiError(500 , "Video not found")
    } 

    const thumbnailPath = req.file?.path

    const uploadedThumbnail = await uploadOnCloudinary(thumbnailPath)

    if(!uploadedThumbnail){
        throw new ApiError(400 , "failed to upload thumbnail")
    }

    const thumbnail = uploadedThumbnail.url
 
    const updatedVideo = await Video.findByIdAndUpdate( videoId , {
        title,
        description,
        thumbnail
    } , { new:true , runValidators: true } )

    if(!updatedVideo){
        throw new ApiError(500 , "failed to update video")
    }

    return res.status(200).json( new ApiResponse(200 , updatedVideo , "ok"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if(!videoId){
        throw new ApiError(40 , "provide videoId")
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId) 

    if( !deletedVideo) {
        throw new ApiError(500 , "video not found")
    }

    return res.status(200).json( new ApiResponse(200 , deletedVideo , "video deleted"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400 , "provide videoId")
    }

    const updatedVideo = await Video.findOneAndUpdate( { _id : videoId }, 
        { $bit: { isPublished: { xor: 1 } } },
        { new:true , runValidators: true } )

    if(!updatedVideo){
        throw new ApiError(500 , "failed to update video")
    }

    return res.status(200).json( new ApiResponse(200 , updatedVideo , "ok"))
})

const videoRecomendations = asyncHandler(async(req , res) => {
    const { count } = req.params;

    const docs =  await Video.aggregate([
        {
            $sample : { size : Number(count) }
        }
    ])

    if(!docs){
        throw new ApiError(500 , "failed to fetch")
    }

    return res.status(200).json( new ApiResponse(200 , docs , "ok"))
})

const increaseVideoViews = asyncHandler(async (req , res) => {
    const { videoId } = req.params ;

    if(!videoId){
        throw new ApiError(400 , "please provide videoId")
    }
    if(!req.user?._id){
        throw new ApiError(400 , "unauthorized processes")
    }

    const increaseView = await Video.findOneAndUpdate(
        {_id : videoId},
        { $inc : { views : 1}},
        { new : true}
    );

    if(!increaseView) {
        throw new ApiError(500 , "failed to increase view")
    }

    const user = await User.findById(req.user?._id)
    console.log(user.watchHistory)

    if(!user){
        throw new ApiError(400 , 'user does not exist')
    }

    if(!user.watchHistory.includes(videoId)){
        user.watchHistory.push(videoId)
        await user.save()
    }

    return res.status(200).json(new ApiResponse( 200 , {increaseView , }  , "view increased"))
})

const getWatchHistory = asyncHandler(async(req , res) => {
    const {userId }= req.params ;
    if(!userId){
        throw new ApiError(400 , "please Provide User Id")
    }
    console.log(typeof(userId))
    const newId = new mongoose.Types.ObjectId(userId)

    const user = await User.findById(newId)

    if(!user){
        throw new ApiError(400 , "User doesnt exist")
    }

    user.watchHistory
    return res.status(200).json( new ApiResponse(200 , user.watchHistory , "watchHistory fetch successful"))
})

export {
    searchVideo,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    videoRecomendations,
    increaseVideoViews,
    getWatchHistory
}

import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

    if(!name || !description) {
        throw new ApiResponse(500 , "Please provide name and description")
    }

    const  playlist = await Playlist.create({
        name ,
        description,
        videos : [] ,
        owner : req.user._id
    })

    const createdPlaylist = await Playlist.findById(playlist._id)
    if(!createdPlaylist){
        throw new ApiError(500 , "failed to create playlist document")
    }

    return res.status(200).json( new ApiResponse( 200 , createdPlaylist , "the playlist created successfully "))

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    const userPlaylist = await Playlist.find({ owner : req.user._id })
    if( userPlaylist.length == 0 || !userPlaylist || !userPlaylist.length ){
        throw new ApiError(400 , "failed to find the playlist from the database")
    }

    return res.status(200).json( new ApiResponse(200 , userPlaylist , "playlist fetch successful"))

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if(!playlistId){
        throw new ApiError(400 , "please provide the playlist Id")
    }
    const userPlaylist = await Playlist.findById(playlistId)
    if( !userPlaylist ){
        throw new ApiError(400 , "failed to find the playlist from the database")
    }

    return res.status(200).json( new ApiResponse(200 , userPlaylist , " perticular playlist fetch successful"))


})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    

    if(!playlistId){
        throw new ApiError(400 , "Playlist Not found")
    }

    if(!videoId){{
        throw new ApiError(400 , "please provide the videoID")
    }}

    const playlist = await Playlist.findByIdAndUpdate( playlistId , {
         $push : { videos : videoId }
    } , { new : true , validators : true})

    const addedVideo = await Playlist.findById(playlistId).lean()

    if(!addedVideo.videos.includes(videoId)){
        throw new ApiError(500 , "failed to save video in playlist")
    }

    return res.status(200).json( new ApiResponse(200 , playlist , "video added"))

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if(!playlistId){
        throw new ApiError(400 , "Playlist Not found")
    }

    if(!videoId){{
        throw new ApiError(400 , "please provide the videoID")
    }}

    const playlist = await Playlist.findOneAndUpdate(
        { _id : playlistId },
        { $pull : { videos : new mongoose.Types.ObjectId(videoId)}},
        { new : true }
    ).lean()

    const playlistData = playlist?.videos?.map( v => v.toString())

    if(playlistData?.includes(videoId)){
        throw new ApiError(500 , "failed to delete video")
    }

    return res.status(200).json( new ApiResponse(200 , playlist , "playlist updated"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if(!playlistId){
        throw new ApiError(400 , "Playlist Not found")
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)

    if(!playlistId){
        throw new ApiError(400 , "play list does not exist")
    }

    return res.status(200).json( new ApiResponse( 200 , deletedPlaylist , "playlist deleted"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!playlistId){
        throw new ApiError(400 , "Playlist Id Not found")
    }

    if(!name){
        throw new ApiError(400 , "name Not found")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        description ? { name , description} : { name } ,
        {
            new : true
        }
    )

    return res.status(200).json( new ApiResponse(200 , updatedPlaylist , "playlist updated"))

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}

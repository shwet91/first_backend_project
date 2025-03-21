import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const skip = ( page - 1 ) * limit

    if(!videoId || !page || !limit){
        throw new ApiError(400 , "pleases provide the videoId")
    }

    const comments = await Comment.find({ video : videoId}).skip(skip).limit(limit)

    return res.status(200).json( new ApiResponse(200 , comments , "All the comments are loaded successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    const {content , videoId} = req.body;
    const {Id} = req.user._id; 

    let savedComment;

    if(!content || ! videoId) {
        throw new ApiError(400 , "invalid content or videoId")
    }

      const comment = await Comment.create({
        content,
        videoId,
        owner: Id    
      })
    
      const createdComment = await Comment.findOne(comment._id)
    
      if(!createdComment){
        throw new ApiError(500, "Something went wrong while creating the comment")
         
      }
  
  
  

  res.status(200).json( new ApiResponse(200 , createdComment , "the comment saved successfully"))

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const { commentId , content } = req.body;

    const comment = await Comment.findById(commentId)

    if(!comment) {
        throw new ApiError(400 , "comment does not exist")
    }

    if( comment.owner !== req.user._id ){
        throw new ApiError(400 , "you are not the owner of the comment you can not update it")
    }

    comment.content = content,
    await comment.save()

    res.status(200).json( new ApiResponse(400 , comment , "comment updated successfully"))

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.body;

    if(!commentId){
        throw new ApiError(400 , "Don't have comment Id")
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId)

    if(!deleteComment){
        throw new ApiError(400 , "This comment does not exist")
    }

    res.status(200).json( new ApiResponse(400 , deletedComment , "The comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }

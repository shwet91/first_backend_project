import { asyncHandler } from "../utils/asynchandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"


// const print = asyncHandler(async (req, res) => {
//     console.log("*********************************************************************************************************")
//     console.log(typeof(req))
//     console.log(req)

//     return res.status(200).json( new ApiResponse(200 , {} , " done"))
// })

const print = asyncHandler(async (req , res) => {

    const {username} = req.params 
    if(!username) {
        throw new ApiError(400 , "invalid username")
    }

    const channel = await User.aggregate([
        {
          $match:{
            username: username?.toLowerCase()
          }
        },
        {
          $lookup:{
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribers"
          }
        },
        {
        
          $lookup:{
            from: "subscriptions",
            localField: "_id",
            foreignField: "subscriber",
            as: "subscribedTo"
        }
      },
      {
        $addFields:{
          subscribersCount: {
            $size: "$subscribers"
          },
          channelSubscribedToCount: {
            $size: "$subscribedTo"
          },
          isSubscribed: {
            $cond: {
              if: {$in: [req.user?._id , "$subscribers.subscriber"] },
              then: true,
              else: false
            }
          }
        }
      },
      {
        $project: {
         fullName: 1,
         username: 1,
         subscribersCount: 1,
         channelSubscribedToCount: 1,
         isSubscribed: 1,
         email: 1,
         avatar: 1,
         coverImage: 1
        }
      }
      ])

    if(!channel){
        throw new ApiError(400 , "data not found")
    }

    const user = await User.findOne({ username });
     console.log(user);


    res.status(200).json( new ApiResponse(200 , channel , "this is it") )

})

export {print}
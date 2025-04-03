import { asyncHandler } from "../utils/asynchandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js";
import { Video } from "../models/video.model.js";

import { SampleDB } from "../models/sample.model.js";


// const print = asyncHandler(async (req, res) => {
//     console.log("*********************************************************************************************************")
//     console.log(typeof(req))
//     console.log(req)

//     return res.status(200).json( new ApiResponse(200 , {} , " done"))
// })

const print = asyncHandler(async (req , res) => {

  const { data } = req.body;

  console.log("this is the test :",req.body)

  if(!data){
    throw new ApiError(400 , "Didnt get the data")
  }

  const savedData = await SampleDB.insertMany(data)

  if(!savedData){
      throw new ApiError(500 , "failed to save the data")
  }


    res.status(200).json( new ApiResponse(200 , savedData, "this is it") )

})


const operation = asyncHandler(async(req , res) => {


  const data = await SampleDB.aggregate([
    // Stage 1: Filter pizza order documents by pizza size
    // {
    //    $match: { size: "medium" }
    // },
    // Stage 2: Group remaining documents by pizza name and calculate total quantity
    {
       $group: {_id: "$name" , totalQuantity : { $sum: "$quantity" }  }
    }
 ])

  if(!data){
    throw new ApiError(500 , "the operation is failed !!")
  }

  return res.status(200)
  .json( new ApiResponse(200 , data , "successful"))
})

const addDummyData = asyncHandler(async(req , res) => {

  const { data  } = req.body ;

  if(!data){
    throw new ApiError(400 , "please provide the data")
  }

  const newData = await Video.insertMany(data)

  return res.status(200).json( new ApiResponse(200 , newData , "ok"))

})

const assignment = async (req , res) => {
  try {
      const response = await fetch("https://api.github.com/users/hiteshchoudhary")


      const data = await response.json()
      
     // console.log(data)

      return res.json( new ApiResponse(200 , data , "ok"))

      
  } catch (error) {
      console.error(error.message)
  }
}

export {print , operation , addDummyData , assignment}
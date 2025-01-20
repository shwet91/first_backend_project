import { asyncHandler } from "../utils/asynchandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"

const print = asyncHandler(async (req, res) => {
    console.log("*********************************************************************************************************")
    console.log(typeof(req))
    console.log(req)

    return res.status(200).json( new ApiResponse(200 , {} , " done"))
})

export {print}
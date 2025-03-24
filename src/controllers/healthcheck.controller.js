import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message

    return res.status(200).json( new ApiResponse(200 , {} , "good health everything is working fine."))
})

export {
    healthcheck
    }


    // 6:00 - 6:30 -> Ready
    // 6:30 - 6:45 -> meal(1)
    // 6:45 - 9:45 -> Coading(3)
    // 9:45 - 10:00 -> meal(2)
    // 10:00 - 12:00 -> Coading(2)
    // 12:00 - 2:00 -> sleep(2)
    // 2:00 - 2:15 -> meal(3)
    // 2:15 - 5:15 -> Coading(3)
    // 5:15 - 5:30 -> meal(4)
    // 5:30 - 7:30 -> Coading(2)
    // 7:30 - 8:00 -> prayer
    // 8:00 - 10:00 ->Coading(2)
    // 10:00 - 10:30 -> Excersise
    // 10:30 - 11:00 -> meal(5)
    // 11:00 - 12:00 -> reserch or dsa or plannings or socialMedia
    // 12:00 - 12:30 -> meditaion



    // 6:00 - 6:30 -> Ready
    // 6:30 - 6:45 -> meal(1)
    // 6:45 - 9:45 -> Coading(3)
    // 9:45 - 10:00 -> meal(2)
    // 10:00 - 10:30 -> Coading(2)
    // 10:30 - 5:00 -> college
    // 5:00 - 5:30 -> meal(3)
    // 5:30 - 7:30 -> Coading(2)
    // 7:30 - 8:00 -> prayer
    // 8:00 - 12:30 -> Coading(4)
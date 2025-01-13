import { asyncHandler } from "../utils/asynchandler.js";


const registerUser = asyncHandler( async (req, res) => {
   
    // get user details from frontend
    // validation - not empty
    // check if user already exist : username, email
    // check for images, check for avatar
    // upload them to cloudinary , avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return res

    const {username, email, fullName , password} = req.body;
    console.log("email: ", email) ;

    if([username, email, fullName, password].some){}


})

export {registerUser}
// require('dotenv').config()
import dotenv from "dotenv"
import {app} from './app.js'

import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

import express from "express";
import connectDB from "./db/index.js";

dotenv.config({
    path: './.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`Server is listening on port: ${process.env.PORT}`);
        
    })
    app.on("error", (error)=> {
        console.log("ERROR: ", error);
        throw error
    })
})
.catch((err)=>{

console.log("Mongo db connection failed !! :", err);

}) 








/*

;( async () => {
    try {
        await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error)=> {
            console.log("ERROR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
        
    }
})()


*/


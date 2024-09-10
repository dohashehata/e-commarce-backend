// import modules
 import mongoose from "mongoose";
export const dbConnection=()=>{
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log("database connected successfully");
     }).catch(()=>{
        console.log("database not connected");
     })
}
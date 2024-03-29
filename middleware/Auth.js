const User = require("../models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.Auth = async(req,res,next) => {
    try{
        //fetch token from req.cookies.token||req.body.token||req.header("Authorisation").replace("Bearer ","")
        const token = req.body.token || req.cookies.token || req.header("Authorisation").replace("Bearer ","");
        //is token missing
        if(!token){
            return res.status(403).json({
                success: false,
                message:"Token is missing"
            });
        }
        //verify token
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log("Decode: ",decode);
            req.user = decode;
        }
        catch(err){
            return res.status(402).json({
                success: false,
                message:"Invalid Token"
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message:"Error in server side while authentication"
        })
    }
}

//isStudent
exports.isStudent = async(req,res) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(402).json({
                success: false,
                message:"This is protected route for students"
            })
        }
        next();
    }
    catch(err){
        console.log(err);
        message:"User role can't be verified, please try again"
    }
}

//isInstructor
exports.isInstructor = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            res.status(402).json({
                success: false,
                message:"This is protected route for instructor"
            })
        }
        next();
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:"User role can't be verified, please try again"
        })
    }
}

//isAdmin
exports.isAdmin = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Admin"){
            res.status(402).json({
                success: false,
                message:"This is protected route for Admin"
            })
        }
        next();
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:"User role can't be verified, please try again"
        })
    }
}
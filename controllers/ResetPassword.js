const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//reset password token

exports.resetPassworToken = async(req,res) => {
   try{
     //fetch data

     const {email} = req.body;

     //check if email is inserted properly
     if(!email){
         return res.status(402).json({
             success: false,
             message:"Please insert the email"
         });
     }
     //verify if user exist or not
     const user = await User.findOne({email});
     if(!user){
         return res.status(402).json({
             success: false,
             message:"User is not registered!! Please register yourself"
         });
     }
     //generate token
     const token = crypto.randomUUID();
     //update the user by adding token and expiration time
     const updateDetails = await User.findOneAndUpdate({email},
         {token: token},
         {resetPasswordExpires: Date.now()+5*60*1000},
         {new:true} 
         )
     //generate url
     const url = `http://localhost:3000/update-password/${token}`;
     //send mail using mailSender function
     await mailSender(email,"Password reset link",`Link for password reseting :- ${url}`);
 
     //return res 
     return res.status(200).json({
         success: true,
         message:"Email sent successfully, please check email and update the password",
         updateDetails
     });
   }
   catch(err){
    console.log(err);
    return res.status(500).json({
        success: false,
        message:"Server error while generating the link for password updation"
    })
   }
}

//reset password

exports.resetPassword = async(req,res)=>{
    try{
        //fetch password, confirm password, token
        const {password,confirmPassword,token} = req.body;
        //verify if all data is inserted
        if(!password || !confirmPassword){
            return res.status(402).json({
                success: false,
                message:"Please fill all the blanks"
            })
        }
        //verify if password == confirm password
        if(password !== confirmPassword){
            return res.status(402).json({
                success: false,
                message:"Password didn't match"
            })
        }
        //fetch document using token
        const userDetails = await User.findOne({token});
        //verify document
        if(!userDetails){
            return res.status(402).json({
                success:false,
                message:"Token is invalid"
            })
        }
        //verify expiry time of token
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(402).json({
                success:false,
                message:"Token is expired!!! please try again"
            });
        }
        //hash password
        let hashPassword = await bcrypt.hash(password,10);
        //update in document
        await User.findOneAndUpdate(
            {token: token},
            {password: hashPassword},
            {new: true}
        );
        //send mail

        await mailSender({email: userDetails.email},"Forget Password","Password is updated");

        //return res
        return res.status(200).json({
            success: true,
            message:"Password is updated"
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"server error while password reseting"
        })
    }
}
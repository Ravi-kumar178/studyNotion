const User = require("../models/User");
const OTP = require("../models/OTP");

//otp generate
exports.sendOTP = async(req,res) => {
    try{
        
        //fetch email from req body

        

        //check if email is inserted 
        //check if the user is already registered
        //generate otp
        //check if the otp generated is same as previous
        //save the email and otp in db
        //return success

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message : "Server Error while sending otp"
        })
    }
}
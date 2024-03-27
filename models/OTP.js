const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true
    },
    otp:{
        type:Number,
        required: true
    },
    createdAt: {
        type:Date,
        default: Date.now(),
        expires: 5*60
    }
});

//function to send email

async function sendVerificationMail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verification OTP for registration",otp);
        console.log("Mail Response:", mailResponse);
    }
    catch(err){
        console.log("Error while Sending mail in sendVerificationMail: ", err);
    }
}

//pre middleware
otpSchema.pre("save",async function(next){
    await sendVerificationMail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", otpSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        trim: true
    },

    lastName:{
        type:String,
        required: true,
        trim: true
    },

    email : {
        type: String,
        required:true,
        trim: true
    },

    phoneNumber:{
        type: Number,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
    },

    accountType:{
        type:String,
        enum:["Student","Instructor","Admin"],
        required: true
    },

    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true
    },

    courses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }],

    courseProgress:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"SubSection"
    },

    image:{
        type: String
    },
    token:{
        type:String
    },
    resetPasswordExpires:{
        type: Date
    }
})

module.exports = mongoose.model("User", userSchema);
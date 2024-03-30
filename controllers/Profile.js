
const Profile = require("../models/Profile");
const User = require("../models/User");

//createProfile handler
exports.createProfile = async(req,res) => {
    try{
        //since profile is set to null in user(signup) controller
        //so we have to basically update the profile object of user
        //fetch userId
        const userId = req.user.id;
        //fetch profession,gender,dateOfBirth,phoneNumber,about
        const{profession,gender,dateOfBirth,phoneNumber,about} = req.body;
        //validate if user is present or not
        if(!userId){
            return res.status(400).json({
                success: false,
                message:"User is not registered,Please Sign up"
            })
        }
        //validate if gender and phone number is available or not because it is required
        if(!gender || !phoneNumber){
            return res.status(400).json({
                success:false,
                message:"Please enter gender and phone number"
            });
        }
        //fetch userDetails by findbyid
        const userDetails = await User.findById(userId);
        //fetch profileId by userDetails.additionalDetails
        const profileId = userDetails.additionalDetails;
        //find profiledetails using profileId
        const profileDetails = await Profile.findById(profileId);
        //updates the key value pair of profile details
        profileDetails.gender = gender;
        profileDetails.profession = profession;
        profileDetails.phoneNumber = phoneNumber;
        profileDetails.about = about;
        profileDetails.dateOfBirth = dateOfBirth;
        //save profiledetails
        await profileDetails.save();
        //return res
        return res.status(200).json({
            success:true,
            message:"Profile is created successfully"
        })


    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:"Server error while creating Profile"
        });
    }
}

//get profile details
exports.getProfile = async(req,res)=>{
    try{
        //fetch user id
        const userId = req.user.id;
        //validate if user is registered
        if(!userId){
            return res.status(400).json({
                success: false,
                message:"User is not registered,Please Sign up"
            })
        }
        //fetch user details and populate by additionalDetails
        const userDetails = await User.findById(userId).populate("additionalDetails").exec();
        //return res
        return res.status(200).json({
            success:true,
            message:"Profile fetched successfully"
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:"Server error while fetching Profile"
        });
    }
}

//delete profile controller
exports.deleteProfile = async(req,res)=>{
    try{
        //fetch userId
        const userId = req.user.id
        //validate user
        if(!userId){
            return res.status(400).json({
                success: false,
                message:"User is not registered"
            })
        }
        //fetch userDetails
        const userDetails = await User.findById(userId);
        //fetch profileId
        const profileId = userDetails.additionalDetails;
        //delete profileId
        await Profile.findByIdAndDelete(profileId);
        //delete user
        await User.findByIdAndDelete(userId);
        //return res
        return res.status(200).json({
            success: true,
            message:"Profile and user delete successfully"
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:"Server error while deleting Profile"
        });
    }
}
const Courses = require("../models/Course");
const Tags = require("../models/Tags");
const User = require("../models/User");
const imageUploader = require("../utils/imageUploader");


require("dotenv").config()
exports.createCourse = async(req,res) => {
    try{
        //fetch data-> courseName, courseDescription, price,whatYouwillLearn,tag
        const{courseName,courseDescription,price,whatYouWillLearn,tag} = req.body;
        //fetch thumbnail
        const thumbnail = req.files.thumbnail;
        //validate if all the data is entered properly
        if(!courseName || !courseDescription || !price || !whatYouWillLearn || !tag){
            return res.status(402).json({
                success: false,
                message:"All blanks are mandatory"
            });
        }
        //validate the instructor
        const userId = req.user.id;
        const instructorDetails = await User.find({userId});
        console.log("Instructor Details: ", instructorDetails);
        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message:"Instructor details not found"
            })
        }
        //validate the tag
        const tagDetails = await Tags.find(tag);
        console.log("Tag Details: ", tagDetails);
        if(!tagDetails){
            return res.status(404).json({
                success: false,
                message:"Tag is not found"
            });
        }
        //upload image to cloudinary
        const thumbnailImage = await imageUploader(thumbnail, process.env.FOLDER_NAME);
        //create course entry in db
        const newCourse = await Courses.create(
            {
                courseName,
                courseDescription,
                whatYouWillLearn,
                price,
                instructorName: instructorDetails._id,
                tag: tagDetails._id,
                thumbnail: thumbnailImage.secure_url
            }
        );
        //push the new course ID in the user
        await User.findByIdAndUpdate(
              {_id:instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id,
                }
            }
        )
        //push the new course ID in the tags
        await Tags.findByIdAndUpdate(
            {_id: tagDetails._id},
            {
                $push:{
                    course:newCourse._id
                }
            }
        )
        //return res
        res.status(200).json({
            success:true,
            message:"Course created successfully"
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:"Server error while creating course"
        })
    }
}

//get all the courses
exports.showAllCourses = async(req,res) => {
    try{
        const allCourses = await Courses.find({},
            {courseName: true, courseDescription: true, price: true,thumbnail:true})
            .populate("instructor")
            .exec();
        
        return res.status(200).json({
            success: true,
            message:"All Courses successfully fetched"
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:"Server error while fetching courses"
        })
    }
}
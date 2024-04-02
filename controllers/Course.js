const Courses = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {imageUploader} = require("../utils/imageUploader");


require("dotenv").config()
exports.createCourse = async(req,res) => {
    try{
        //fetch data-> courseName, courseDescription, price,whatYouwillLearn,tag
        const{courseName,courseDescription,price,whatYouWillLearn,tag,instructions,status,category} = req.body;
        //fetch thumbnail
        const thumbnail = req.files.thumbnail;
        //validate if all the data is entered properly
        if(!courseName || !courseDescription || !price || !whatYouWillLearn || !tag || !category){
            return res.status(402).json({
                success: false,
                message:"All blanks are mandatory"
            });
        }

        if(!status || status === undefined){
            status = "Draft"
        }

        //validate the instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId,{accountType:"Instructor"});
        console.log("Instructor Details: ", instructorDetails);
        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message:"Instructor details not found"
            })
        }
        //validate the tag
        const categoryDetails = await Category.findById(category);
        console.log("Tag Details: ", categoryDetails);
        if(!categoryDetails){
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
                category: categoryDetails._id,
                thumbnail: thumbnailImage.secure_url,
                instructions,
                status,
                tag
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
        await Category.findByIdAndUpdate(
            {_id: categoryDetails._id},
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
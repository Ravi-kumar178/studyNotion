const ratingAndReview = require("../models/ReviewAndRating");
const User = require("../models/User");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//createRatingAndReview handler
exports.ratingAndReview = async(req,res) => {
    try{
        //fetch userID
        const userId = req.user.id;
        //fetch courseId,rating and review
        const {courseId,rating,review} = req.body;
        //validate courseId, rating
        if(!courseId || !rating){
            return res.status(404).json({
                success: false,
                message:"Please provide courseId and rating"
            });
        } 
        //validate if course details is present or not 
        //validate if user is enrolled to course or not
        const courseDetails = await Course.findOne(
                                      {
                                        _id: courseId,
                                        studentsEnrolled:{$elemMatch:{$eq:userId}}
                                      }
                                    );

        if(!courseDetails){
            return res.status.json({
                success: false,
                message:"Student is not enrolled or Course is not present"
            });
        }
        
        //validate if rating is already done
        const alreadyReview = await ratingAndReview.findOne({
            user:userId,course:courseId
        });
        if(alreadyReview){
            return res.status(400).json({
                success: false,
                message:"User is already reviewed on course"
            });
        }
        //create rating and review
        const ratingReview = await ratingAndReview.create({
            rating,review,
            course: courseId,
            user: userId
        });

        const updateCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    reviewAndRating:ratingReview.id,
                }
            },
            {new:true},
        );

        //return res
        return res.status(200).json({
            success: true,
            message:"Rating and Review is created successfully"
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:"Server error while creating Rating and Review"
        });
    }
}

//get average rating

exports.getAverageRating = async(req,res) => {
    try{
        //fetch courseId
        const {courseId} = req.body;
        //get average rating
        const result = await ratingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId("courseId")
                },
            },
            {
                $group:{
                    _id: null,
                    averageRating: {$avg:"$rating"}
                }
            }
        ]);
        //if length > 0, result average rating
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating
            });
        }
        //return res
        return res.status(200).json({
            success: true,
            message:"Average rating is 0, no rating is present",
            averageRating : 0
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:"Server error while getting average rating"
        });
    }
}

//get all rating
exports.getAllRating = async(req,res) => {
    try{
        //find all rating and review
        const allRating = await ratingAndReview.find({})
                                .sort("desc")
                                .populate({
                                    path:"user",
                                    select:"firstName lastName email image"
                                })
                                .populate({
                                    path:"course",
                                    select:"courseName"
                                })
                                .exec();

        //return res
        return res.status(200).json({
            success: true,
            message:"All reviews fetched successfully",
            data: allRating
        })                       
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:"Server error while creating Rating and Review"
        });
    }
}
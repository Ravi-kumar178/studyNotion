const {instance} = require("../config/Razorpay");
const User = require("../models/User");
const Course = require("../models/Course");
const {mailSender} = require("../utils/mailSender");
const { default: mongoose } = require("mongoose");
const { json } = require("express");

//create order
exports.createOrder = async(req,res)=>{
    try{
        //fetch user_id and courseId
        const courseId = req.body;
        const userId = req.user.id;
        //verify courseId
        if(!courseId){
            return res.status(400).json({
                success: false,
                message: "Please Enter Valid Course-ID"
            });
        }
        //find courseDetails
        const courseDetails = await Course.findById(courseId);
        //verify if course present or not
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message:"No Course is present"
            });
        }
        //verify if already purchased -> courseDetails.enrolledStudent.include(courseId)
        const uid = new mongoose.Types.ObjectId.createFromHexString(userId);
        if(courseDetails.studentsEnrolled.includes(uid)){
            return res.status(400).json({
                success: false,
                message: "Student is already enrolled to the course"
            });
        }
        
        //create amount and currency
        const amount = courseDetails.price;
        const currency = "INR";
        //create options and insert courseId and UserId by creating a object
        const options = {
            amount: amount*100,
            currency,
            receiptID : Math.random(Date.now()).toString(),
            notes:{
                userId,
                courseId
            }
        }

        const paymentResponse = await instance.orders.create(options);
        console.log("Payment Response: ",paymentResponse);
        //return res
        return res.status(200).json({
            success: true,
            message:"Order Created Successfully",
            courseName : courseDetails.courseName,
            courseDescription : courseDetails.courseDescription,
            thumbnail : courseDetails.thumbnail,
            orderId : paymentResponse.id,
            amount : paymentResponse.amount,
            currency: paymentResponse.currency
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:"Server error in creating order"
        })
    }
}

//verify signature
exports.verifySignature = async(req,res) => {
    try{
        //webhook secret
        const webhookSecret = "1234567";
        //signature
        const signature = req.header("x-razorpay-signature");
        const shasum = crypto.createHmac("SHA256",webhookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");
     
        //if signature == digest -> 
        if(digest == signature){
           //fetch courseId and userId from notes of options
           const {courseId,userId} = req.body.payload.payment.entity.notes;
           //update enrolledStudents and courses
           const enrolledStudent = await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push:{
                                                    studentsEnrolled:userId
                                                },  
                                            },
                                            {new: true}
           )

           const enrolledCourse = await User.findByIdAndUpdate(
                                            userId,
                                            {
                                                $push:{
                                                    courses: courseId
                                                }
                                            },
                                            {new:true}
           );
           //send mail
           const userDetails = await User.findById(userId);
           const email = userDetails.email;
           const courseDetails = await Course.findById(courseId);
           const courseName = courseDetails.courseName;
           const mailResponse = await mailSender(email,"Congratulations from Study-Notion",`Congratulations!! you are onboarder on a study notion in a ${courseName}`);
           //return res
           return res.status(200).json({
            success: true,
            message:"Course purchased successfully"
           })
        }
        else{
            return res.status(400).json({
                success: false,
                message:"Webhook Secret does not match with razorpay signature"
            });
        }
       

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message:"Server error in verifying signature"
        })
    }
}
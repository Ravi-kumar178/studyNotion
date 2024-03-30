const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { imageUploader } = require("../utils/imageUploader");

require("dotenv").config();
//create sub-section controller
exports.createSubSection = async(req,res)=>{
    try{
        //fetch title,description,timeDuration, sectionId
        const {title,description,timeDuration,sectionId} = req.body;
        //fetch video
        const video = req.files.videoFile;
        //validate if sectionid is present
        if(!sectionId){
            return res.status(400).json({
                success: false,
                message:"Section is not available,please create section first"
            });
        }
        //validate if all details are present
        if(!title || !description || !timeDuration || !video){
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory"
            });
        }
        //upload video by calling imageuploader function
        const videoDetails = await imageUploader(video,process.env.FOLDER_NAME);
        //create obj in subsection db
        const subSectionDetails = await SubSection.create({
            title,description,duration:timeDuration,
            videoUrl:videoDetails.secure_url
        });
        //push sub-section in section by findbyidandupdate and polpulate
        const updateSection = await Section.findByIdAndUpdate(sectionId,
                                            {$push:subSectionDetails._id},
                                            {new:true})
                                            .populate("SubSection")
                                            .exec();
        //return res-> success
        return res.status(200).json({
            success: true,
            message:"Sub Section created successfully"
        })
    }
    catch(err){
         console.log(err);
         return res.status(500).json({
            success: false,
            message: "Server error while creating sub section"
         });
    }
}

//update sub section
exports.updateSubSection = async(req,res)=>{
    try{
        //fetch all data
        const {subSectionId,title,description,timeDuration} = req.body;
        //validate if subsection is available
        if(!subSectionId){
            return res.status(400).json({
                success:false,
                message:"Sub Section is not available,Create it before updating"
            });
        }
        //fetch video
        const video = req.files.videoFile;
        //validate all fields
        if(!title || !description || !timeDuration || !video){
            return res.status(200).json({
                success: true,
                message:"All fields are mandatory"
            })
        }

        //upload file
        const videoDetails = await imageUploader(video,process.env.FOLDER_NAME);
        //findByIdAndUpdate
        await SubSection.findByIdAndUpdate(subSectionId,
                                            {title:title},
                                            {description:description},
                                            {duration:timeDuration},
                                            {videoUrl:videoDetails.secure_url});
        //return res->success
        return res.status(200).json({
            success:true,
            message:"Sub Section updated successfully"
        });

    }
    catch(err){
        console.log(err);
         return res.status(500).json({
            success: false,
            message: "Server error while updating sub section"
         });
    }
}

//get subsection
exports.getSubSection = async(req,res)=>{
    try{
        //fetch subSection id
        const {subSectionId} = req.body;
        //validate whether sub section present or not
        if(!subSectionId){
            return res.status(400).json({
                success:false,
                message:"Sub Section is not available,Create it before fetching"
            });
        }
        //fetch subSection by findById
         await SubSection.findById(subSectionId);
        //return res
        return res.status(200).json({
            success: true,
            message:"Sub Section fetched successfully"
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
           success: false,
           message: "Server error while fetching sub section"
        });
    }
}

//delete subSection
exports.deleteSubSection = async(req,res)=>{
    try{
        //fetch subSectionId
        const {subSectionId} = req.body;
        //validate
        if(!subSectionId){
            return res.status(400).json({
                success:false,
                message:"Sub Section not available"
            });
        }
        //findbyidanddelete
        await SubSection.findByIdAndDelete(subSectionId);
        //return res
        return res.status(200).json({
            success:true,
            message:"Sub Section deleted successfully"
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
           success: false,
           message: "Server error while deleting sub section"
        });
    }
}
const Course = require("../models/Course");
const Section = require("../models/Section");

//create section
exports.createSection = async(req,res) => {
    try{
        //get courseID and sectionName
        const {courseId, sectionName} = req.body;
        //if not courseID then return res to add course
        if(!courseId){
            return res.status(402).json({
                success: false,
                message:"Course is not created,Please create course"
            });
        }
       
        //if not section name then return res to all fields are mandatory
        if(!sectionName){
            return res.status(402).json({
                success: false,
                message: "All fields are mandatory"
            });
        }
        //create section object in db
        const newSection = await Section.create({sectionName});
        //findbyIDandUpdate courseID and push section id
        const updatedCourseDetails = await Course.findByIdAndUpdate({courseId},
                                                                   {
                                                                    $push:{courseContent:newSection._id}
                                                                   },
                                                                   {new: true},
                                                                  ).populate("courseContent").exec();
        //return res to success
        return res.status(200).json({
            success: true,
            message:"Section is created successfully",
            updatedCourseDetails,
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server error while creating section"
        })
    }
}

//update section
exports.updateSection = async(req,res) => {
    try{
        //get name and sectionID
        const {sectionName,sectionID} = req.body;
        //if not sectionID -> return res-> section doesnot exist
        if(!sectionID){
            return res.status(400).json({
                success: false,
                message: "Section not created, please create the section first"
            })
        }
        //if not sectionName -> return res-> all fields mandatory
        if(!sectionName){
            return res.status(400).json({
                success: false,
                message:"All fields are mandatory"
            })
        }
        //findbyidandupdate
        const updateSectionDetails = await Section.findByIdAndUpdate(
                                        {sectionID},
                                        {sectionName},
                                        {new: true},
        );
        //return res->sucess
        return res.success(200).json({
            success: true,
            message:"Section is updated"
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server error while updating section"
        })
    }
}

//get section
exports.getSection = async(req,res)=>{
    try{
        //fetch section id
        const {sectionId} = req.body;
        //validate whether section is created or not
        if(!sectionId){
            return res.status(400).json({
                success: false,
                message:"Section is not created, please create the section first"
            });
        }
        //fetch section by section id
        const sectionDetails = await Section.findById(sectionId);
        //return res
        return res.status(200).json({
            success: true,
            message:"Fetched the section"
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:"Server error while fetching section"
        })
    }
}

//delete section
exports.deleteSection = async(req,res) => {
    try{
        //fetch sectionID
        const {sectionId} = req.body;
        //validate wheteher section is created or not
        if(!sectionId){
            return res.status(400).json({
                success: false,
                message:"Section is not available"
            });
        }
        //findByidanddelete using sectionid 
        await Section.findByIdAndDelete(sectionId);
        //return res->success
        return res.status(200).json({
            success: true,
            message:"Section deleted successfully"
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:"Server error while deleting section"
        })
    }
}
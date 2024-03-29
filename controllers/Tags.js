const Tags = require("../models/Tags");

exports.createTags = async(req,res) => {
    try{
        const{name,description} = req.body;
        //validation
        if(!name || !description){
            return res.status(402).json({
                success: false,
                message:"All fields are mandatory"
            });
        }
        //create db entry
        const tagDB = await Tags.create({name,description});
        //return res
        return res.status(200).json({
            success: true,
            message:"Tag created successfully",
            tagDB
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server error while creating tag"
        })
    }
}

//get all tags controller

exports.showAllTags = async(req,res) => {
    try{
        //find all tag
        const allTags = await Tags.find({},
            {name: true, description:true});
        //return
        return res.status(200).json({
            success: true,
            message: "Tag is fetched successfully",
            allTags
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:"Server error while fetching tag"
        })
    }
}
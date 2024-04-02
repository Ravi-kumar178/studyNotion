const Category = require("../models/Category");

exports.createCategory = async(req,res) => {
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
        const categoryDB = await Category.create({name,description});
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

//get all Category controller

exports.showAllCategory = async(req,res) => {
    try{
        //find all tag
        const allCategory = await Category.find({},
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
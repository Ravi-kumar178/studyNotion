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
            data: allCategory
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:"Server error while fetching category"
        })
    }
}

//category page details
exports.categoryPageDetails = async(req,res)=>{
    try{
        //fetch category id
        const {categoryId} = req.body;
        //find category details and populate course and reviewAndRating
        const categoryDetails = await Category.find(categoryId)
                                            .populate({
                                                path:"course",
                                                populate:{
                                                    path:"reviewAndRating"
                                                }
                                            })
                                            .exec();
        //validate if the category detail is present or not
        if(!categoryDetails){
            return res.status.json({
                success: false,
                message:"No Course is present with this category"
            });
        }
        //find the category detail whose id is not equal to category id
        const differentCategoryDetails = await Category.find(
                                                {_id:{$neq : categoryId}}
                                                )
                                                .populate({
                                                    path:"course",
                                                    populate:{
                                                        path:"reviewAndRating"
                                                    }
                                                })
                                                .exec();

        //validate
        if(!differentCategoryDetails){
            return res.status.json({
                success: false,
                message:"No course is available without the categorized course right now"
            });
        }
        //find best selling
        //return res -> with all data

        return res.status(200).json({
            success: true,
            data: categoryDetails,
                  differentCategoryDetails
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:"Server error while fetching category details"
        })
    }
}

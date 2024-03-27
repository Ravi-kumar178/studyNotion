const mongoose = require("mongoose");

const reviewAndRatingSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    review:{
        type: String
    },
    rating:{
        type:Number,
        required: true
    }
})

module.exports = mongoose.model("ReviewAndRating",reviewAndRatingSchema);
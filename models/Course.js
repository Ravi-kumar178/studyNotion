const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName:{
        type: String,
        required: true,
        trim: true
    },

    courseDescription:{
        type: String,
        required: true
    },

    studentsEnrolled:[
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }
    ],

    instructorName : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    whatYouWillLearn: {
        type: String,
        required: true
    },

    courseContent : [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Section"
    }],

    reviewAndRating: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"ReviewAndRating"
    }],

    price:{
        type: Number,
        required: true
    },

    thumbnail :{
        type: String
    },

    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },

    tag: {
		type: [String],
		required: true,
	},

    instructions: {
		type: [String],
	},

    status:{
        type: String,
        enum:["Published","Draft"]
    }
});

module.exports = mongoose.model("Course", courseSchema);
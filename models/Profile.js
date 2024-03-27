const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    profession: {
        type: String,
        trim: true,
        required: true
    },
    gender:{
        type: String,
        trim: true,
        required: true
    },
    dateOfBirth:{
        type: Date,
        trim: true,
        required: true
    },
    phoneNumber:{
        type: Number,
        required: true,
        trim: true
    },
    about:{
        type: String,
    }
});

module.exports = mongoose.model("Profile", profileSchema);
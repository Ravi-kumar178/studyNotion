const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
    const url = process.env.DATABASE_URL;

    //if not url
    if(!url){
        console.log("Please enter the url of database in env file");
    }

    mongoose.connect(url,{
        useNewUrlParser: true,
        useUnifiedTopology:true
    })
    .then(()=>{console.log("Database connected successfully")})
    .catch((err)=>{
        console.log(err);
        process.exit(1);
    })
}

module.exports = dbConnect;
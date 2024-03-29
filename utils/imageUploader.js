const cloudinary = require("cloudinary").v2;

exports.imageUploader = async(file,folder,quality,height) => {
    {
        const options = {folder};
        if(quality){
            options.quality = quality;
        }
        if(height){
            options.height = height;
        }
        options.resource_type = "auto";

        await cloudinary.uploader.upload(file.tempFilePath,options);
    }
}
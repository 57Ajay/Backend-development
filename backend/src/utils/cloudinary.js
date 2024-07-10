import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
config();
import fs from 'fs';
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY 
});

const uploadOnCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        console.log("uploaded", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // removes the locally saved temp file as the upload failed
        return null;
    }
};

export { uploadOnCloudinary };


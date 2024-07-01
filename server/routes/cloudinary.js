const cloud_Name = "products-gog";
const api_Key = "362596442895367";
const api_secretkey = "BICt9YAGoDn35ClvbuobPVnR3NQ";

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: cloud_Name,
    api_key:api_Key,
    api_secret: api_secretkey
})

uploadToCloudinary = async (path, folder) => {
    try {
        const data = await cloudinary.v2.uploader.upload(path, {
            folder
        });
        return { url: data.url, public_id: data.public_id };
    } catch (error) {
        console.log(error);
    }
};

removeFromCloudinary = async (public_id) => {
    await cloudinary.v2.uploader.destroy(public_id, function(error, result){
        console.log(result, error);
    })
}

module.exports  = {uploadToCloudinary, removeFromCloudinary}
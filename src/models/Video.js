import mongoose from "mongoose";
import moment from "moment";
const videoSchema = new mongoose.Schema({
    title: {type:String, required:true, uppercase:true, trim: true, minlength: 5},
    fileUrl : {type: String, required:true},
    thumbUrl: { type: String },
    description: {type:String, required:true, trim: true, maxLength: 100},
    createdAt: {
        type:String,
        required:true,
        default: moment().format('YYYY-MM-DD HH:mm')
    },
    hashtags: [{
        type:String,
        trim: true
    }],
    meta: {
        views: {type:Number, default:0, required: true},
        rating: {type:Number, default:0, required: true},
    },
    comments:[{type:mongoose.Schema.Types.ObjectId, ref:"Comment"}],
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
}); 
videoSchema.static("formatHashtags", function(hashtags){
return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));})   


const Video = mongoose.model("Video", videoSchema);

export default Video;

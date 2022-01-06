
import User from "../models/User";
import Video from "../models/Video";
import moment from "moment";

export const home = async (req, res) =>{ 

    const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");

 return res.render("home", {pageTitle: "Home", videos})
};
export const getSearch = async (req, res) => {
    return res.render("search", {pageTitle:"Search Video"});
};
export const postSearch = async (req, res) => {
    const {keyword} = req.body;
    const videos = await Video.find({
        title:{ 
            $regex: `^${keyword}`, 
            $options: 'i' }
    }).populate("owner");
    if(videos){
        return res.render("search", {pageTitle:"Search Video", videos});
    }else{
        return res.render("search", {pageTitle:"Search", error:"Sorry, There are no such videos"});
    }
   
}
export const see = async (req, res)=> {
    const {id} = req.params;  
    const video = await Video.findById(id).populate("owner");
    if(video){
        return res.render("see", {pageTitle: "See this Video", video});
    }else{
        return res.status(404).render("404", {pageTitle:"Error: Video not found"})
    }
 
};
export const getUpload = (req, res)=> res.render("upload", {pageTitle: "Upload your Video"});
export const postUpload = async (req, res) => {
  const {_id} = req.session.user;
 const {file} = req;
const { title, description, hashtags } = req.body;
try{
  const newVideo = await Video.create({
    title,  
    fileUrl:file.path,
    description,
    hashtags: Video.formatHashtags(hashtags),
    meta: {
        views: 0,
        rating: 0,
    }, 
    owner: _id,
});
const user = await User.findById(_id);
user.videos.push(newVideo._id);
user.save();
return res.redirect("/");
}catch(error){
 
    return res.status(400).render("upload", {
        pageTitle: "Upload Video",
        path:error.errors.title.path,
        errorMessage: error._message,
});
}
}
export const getEdit = async (req, res)=> {
const {id} = req.params;
const { user : {_id}} = req.session;
const video = await Video.findById(id);
if(!video){
    return res.status(404).render("404", {pageTitle:"Error: Video not found"})
}
if(String(video.owner) !== String(_id)){
    return res.status(403).redirect("/");
}
    res.render("edit", {pageTitle:"Edit your Video", video });
 
};

export const postEdit = async (req, res) => {
    const {id} = req.params;
    const {title, description, hashtags} = req.body;
    const video = await Video.exists({_id:id});
    if(!video) {
        return res.status(404).render("404", {pageTitle: "Video not found"});
    }else{
        await Video.findByIdAndUpdate(id, {
            title,
            description,
            hashtags: Video.formatHashtags(hashtags),
            meta: {
                views: 0,
                rating: 0,
            },
        })
        return res.redirect("/");
    }
};
export const remove = async (req, res)=> {
    const {id} = req.params;
    const { user : {_id}} = req.session;
const video = await Video.findById(id);
if(!video){
    return res.status(404).render("404", {pageTitle:"Error: Video not found"})
}
if(String(video.owner) !== String(_id)){
    return res.status(403).redirect("/");
}
 await Video.deleteOne({_id:id});
 return res.redirect("/");
};

import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

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
    const video = await Video.findById(id).populate("owner").populate("comments"); 
    if(video){
        return res.render("see", {pageTitle: "See this Video", video});
    }else{
        return res.status(404).render("404", {pageTitle:"Error: Video not found"})
    }
 
};
export const getUpload = (req, res)=> res.render("upload", {pageTitle: "Upload your Video"});
export const postUpload = async (req, res) => {
  const {_id} = req.session.user;
  const {files} = req;
const { title, description, hashtags } = req.body;
try{
  const newVideo = await Video.create({
    title,  
    fileUrl:files.video[0].location,
    thumbUrl: files.thumb ? files.thumb[0].location : "",
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
req.flash('info', 'just added your video');
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
    req.flash("error", "Not authorized");
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
export const registerView = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
  };
export const createComment = async (req, res) => {
const {
    session:{user},
    body:{text},
    params:{id},
} = req;
const video = await Video.findById(id);


if (!video) {
  return res.sendStatus(404);
}
const comment = await Comment.create({
  text,
  owner: user._id,
  video: id,
});
video.comments.push(comment._id);
req.session.user.comments.push(comment._id);
video.save();

return res.status(201).json({newCommentId: comment._id});
};

export const deleteComment = async (req, res)=>{
const {id} = req.params;
const comment = await Comment.findOne({_id:id});
if(String(comment.owner) !== String(req.session.user._id)){
    return res.sendStatus(404);  
}
await Comment.deleteOne({_id:id});
return res.sendStatus(201);
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
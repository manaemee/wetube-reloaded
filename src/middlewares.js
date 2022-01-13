import e from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";


const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const multerUploader = multerS3({
  s3:s3,
  bucket: 'mantube',
  acl: "public-read"
})
export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = req.session.loggedIn;
res.locals.stieName = "wetube";
res.locals.loggedInUser = req.session.user || {};
    next();
}//현재 누가 로그인 했는지 알려줌.

export const protectMiddleware = (req, res, next) => {
  if(req.session.loggedIn){
    next()
  }else{
    req.flash("error", "Not authorized");
    return res.redirect("/login");
  }
};

export const publiOnlyMiddleware = (req, res, next) =>{
  if(!req.session.loggedIn){
    return next();
  }else{
    req.flash("error", "Not authorized");
    return res.redirect("/")
  }
};

export const avatarUpload = multer({dest:"uploads/avatars", 
dest: "uploads/avatars/",
limits:{
  fileSize:30000000,
},
storage: multerUploader
})

export const videoUpload = multer({dest:"uploads/videos/", 
dest:"uploads/videos/",
limits:{
fileSize:10074035,
},
storage: multerUploader
})
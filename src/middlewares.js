import e from "express";
import multer from "multer";
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
    return res.redirect("/login");
  }
};

export const publiOnlyMiddleware = (req, res, next) =>{
  if(!req.session.loggedIn){
    return next();
  }else{
    return res.redirect("/")
  }
};

export const avatarUpload = multer({dest:"uploads/avatars", limits:{
  fileSize:30000000,
}})
export const videoUpload = multer({dest:"uploads/videos/", limits:{
fileSize:10074035,
}})
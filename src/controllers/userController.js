import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import Video from "../models/Video";


export const getJoin = (req, res) => res.render("join",{pageTitle:"Create Account"});
export const postJoin = async (req, res) => {
const {name, email, username, password, password2} = req.body;
if(password !== password2){
return res.status(400).render("join", {
    pageTitle:"Join",
    errorMessage:"Password confirmation does not match.",
})
};
const twoExists = await User.findOne({username, email});
if(twoExists){
    return res.status(400).render("join", {
        pageTitle:"Join",
        errorMessage:"This username/email are already taken.",
    })
}
const usernameExists = await User.exists({username});
if(usernameExists){
    return res.status(400).render("join", {
        pageTitle: "Join",
        errorMessage: "This username is already taken.",
    });
}
const emailExists = await User.exists({email});
if(emailExists){
    return res.status(400).render("join", {
        pageTitle:"Join",
        errorMessage:"This email is already taken.",
    })
}
await User.create({
    email,
    username,
    password,
    name
})
return res.redirect("/login");
}
export const getLogin= (req, res) => {
  return res.render("login", {pageTitle:"Login"})
};

export const postLogin =async (req, res) => {
    const {username, password} = req.body;
    const exists = await User.findOne({username});
if(!exists){
        return res.status(400)
        .render("login", {
            pageTitle:"Login",
            errorMessage: "An account with this username does not exists.",
        });
    }
const passwordCheck= await bcrypt.compare(password, exists.password); 
if(!passwordCheck){
    return res.status(400).render("login", {
        pageTitle:"Login",
        errorMessage: "Password is wrong",
    });
};
req.session.loggedIn = true;
req.session.user= exists ;
return res.redirect("/");
};

export const startKaKaoLogin = (req, res) => {
const config ={
    response_type:"code",
    client_id:"aec21ffd242df9ad550bd3020ee6b200",
    redirect_uri:"https://shetube-reloaded.herokuapp.com/users/github/callback"
}    
const params = new URLSearchParams(config).toString();

const finalUrl = `https://kauth.kakao.com/oauth/authorize?${params}`;
return res.redirect(finalUrl);
};

export const finishKaKaoLogin = async (req, res) =>{
    const baseUrl = "https://kauth.kakao.com/oauth/token";
  const config = {
    grant_type: "authorization_code",
    client_id:"aec21ffd242df9ad550bd3020ee6b200",
    redirect_uri:"https://shetube-reloaded.herokuapp.com/users/github/callback",
    code:req.query.code,
  }
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const json = await(await fetch(finalUrl,{
      method:"POST",
      headers :{
        "Content-Type": "application/x-www-form-urlencoded" 
      }
  })).json();
if("access_token" in json){
const {access_token} = json;
const userRequest = await(await fetch("https://kapi.kakao.com/v2/user/me",{
headers:{
    Authorization: `Bearer ${access_token}`,
}
})).json();
let user = await User.findOne({email:userRequest.kakao_account.email});
if(!user){
  user = await User.create({
        email:userRequest.kakao_account.email,
        username:userRequest.kakao_account.profile.nickname,
        password:"",
        name:userRequest.kakao_account.profile.nickname,
        socialOnly:true,
    })
}
console.log(user);
req.session.loggedIn = true;
req.session.user = user;
console.log(req.session);
return res.redirect("/");
}else{
    return res.redirect("/login");
}
};

export const getEdit = (req,res) => res.render("edit-profile", {pageTitle:"Edit profile"});
export const postEdit = async (req, res) => {
const {
      session: {
        user: { _id, thumbnail, email: sessionEmail, username: sessionUsername },
      },
      body: {email, username},
      file,
    } = req;
const Exists= await User.findOne( { username, email });

if(Exists){
    const user = await User.findByIdAndUpdate(_id, {
        thumbnail: file ? file.path : thumbnail,
      },
      { new: true }
      );     
      req.session.user=user;
      return res.redirect("/users/edit");

    }
if(sessionEmail !== email){
    const emailExists = await User.findOne( { email });
    if(emailExists){
       return res.status(400).render("edit-profile", {pageTitle:"edit-profile", errorMessage:"This e-mail is already taken!"})
    }
}   
if(sessionUsername !== username){
    const usernameExists = await User.findOne( { username });
    if(usernameExists){
        return res.status(400).render("edit-profile", {pageTitle:"edit-profile", errorMessage:"This username is already taken!"})
     }
}    
        const user = await User.findByIdAndUpdate(_id, {
            thumbnail: file ? file.path : thumbnail,
            email,
            username,
          },
          { new: true }
          );     
          req.session.user=user;
          return res.redirect("/users/edit");
        };
    
   
export const getChangePassword = (req, res) =>{
    if(req.session.user.socialOnly === true){
        req.flash("error", "You don't have password.");
        return res.redirect("/");
    }
return res.render("users/change-password",{pageTitle:"change-password"})
}    
export const postChangePassword = async (req, res) =>{
    const{
        session:{
            user:{_id, password},
        },
        body: { oldPassword, newPassword, newPasswordConfirmation },
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    
    if(!ok){
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The current password is incorrect",
          });
    }
    if (newPassword !== newPasswordConfirmation) {
        return res.status(400).render("users/change-password", {
          pageTitle: "Change Password",
          errorMessage: "The password does not match the confirmation",
        });
    }
    user.password = newPassword;
    req.flash("info", "Password updated!");
    await user.save();
    
    return res.redirect("/")
};    
export const myProfile = async (req, res) =>{
    const {id} = req.params;
    const user = await User.findById(id).populate({
        path:"videos",
        populate:{
            path:"owner",
        }
        });
    if(!user){
        return res.status(404).render("404", {pageTitle:"User is not found"});
    }
    return res.render("users/profile", {pageTitle:user.name, user});
}
export const logout = (req, res) => {
    req.session.user= null;
    req.session.loggedIn = false; 
    req.flash("info", "Bye Bye");
    return res.redirect("/");
}


import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL)

const db = mongoose.connection;

db.on("error" , (error) => console.log("Db Error", error));
db.once("open", ()=> console.log("DB is Connected"));


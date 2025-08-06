import express from "express";
import dotenv from "dotenv";
import MongoStore from 'connect-mongo';
import session from "express-session";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectDB } from "./DB/connectDB.js";
import authRouter from "./Routers/auth.router.js";
dotenv.config();
import errorHandler from "./Middleware/errorHandler.js";
import mongoose from "mongoose";
const app = express();
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log (process.env.SESSION_SECRET)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL, // Replace with your MongoDB connection string
      collectionName: "sessions",
      autoRemove: "native",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365, // 7 days
      secure: (process.env.NODE_ENV === "production" ),
      httpOnly: true,
      sameSite: "strict",
    },
  })
);



app.use('/api/auth',authRouter);


app.use(errorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
 connectDB() ;  
console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
if (process.env.NODE_ENV === "development") {
  console.log(`http://localhost:${PORT}`);
}

})



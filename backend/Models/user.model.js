import mongoose from 'mongoose';
import { compareValue, hashValue } from '../Utils/bcrypt.js';
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
   
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next){
  if (!this.isModified("password")) {
    return(next);
  }
  this.password = await hashValue(this.password);
  next();
});
userSchema.methods.comparePassword = async function (value) {
  return compareValue(value,this.password)
  
}
userSchema.methods.pomitPassword =  function () {
   const user = this.toObject({ versionKey: false });
  delete user.password;
  return user;
}


export const User =mongoose.model('User',userSchema)
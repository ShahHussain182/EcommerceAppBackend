import { User } from "../Models/user.model.js";
import { codeSchema, loginSchema, signupSchema } from "../Schemas/authSchema.js";
import { VerificationCodeModel } from "../Models/verificationCode.model.js";
import catchErrors from "../Utils/catchErrors.js";
import verificationCodeType from "../Constants/verificationCodeType.js";
import { oneHourFromNow } from "../Utils/date.js";
import { signAccessToken, signRefreshToken } from "../Utils/generateTokens.js";
import { setCookies } from "../Utils/setCookie.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";
export const signup = catchErrors(async (req,res,next) => {
  
  
  const data = signupSchema.parse({
    ...req.body,
  });
  const { userName, firstName, lastName, email, password, phoneNumber } = data;
  const existingUser = await User.findOne({
    $or: [{ email }, { userName }, { phoneNumber }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    } else if (existingUser.userName === userName) {
      return res.status(400).json({
        success: false,
        message: "Username already exists.",
      });
    } else if (existingUser.phoneNumber === phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists.",
      });
    }
  }
  const user = await User.create({
    userName,
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
  });
  
 
  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: verificationCodeType.EmailVerification,
    expiresAt: oneHourFromNow(),
  });

      
  const accessToken = await signAccessToken({ userId: user._id.toString() , sessionId : req.sessionID});
  const refreshToken = await signRefreshToken({
    userId: user._id.toString(),
    sessionId: req.sessionID,
  });
 
  req.session.userId = user._id;
  req.session.token = accessToken;
  setCookies(res, accessToken, "AccessToken");
  setCookies(res, refreshToken, "RefreshToken");
   
   await sendVerificationEmail(user.email,verificationCode.code);
   
  res.status(200).json({
    success: true,
    user:user.pomitPassword(),
    messaage: "User Created Successfully",
    session : req.session
  });
});

export const verifyEmail = catchErrors(async (req, res) => {
  const verificationCode = codeSchema.parse(req.body.code);
  const validCode = await VerificationCodeModel.findOne({
    code: verificationCode,
    type: verificationCodeType.EmailVerification,
    expiresAt: { $gt: Date.now() },
  });
  if (!validCode) {
    return res.status(400).json({
      success: false,
      message: "Invalid or Expired Code.",
    });
  }
  const updatedUser = await User.findByIdAndUpdate(
    validCode.userId,
    { isVerified: true },
    { new: true }
  );
  if (!updatedUser) {
    return res.status(400).json({
      success: false,
      message: "Failed to verify email.",
    });
  }
  await validCode.deleteOne();
  
  res.status(200).json({
    success: true,
    user: updatedUser.pomitPassword(),
    messaage: "Email verified Successfully",
    session: req.session,
  });
});
export const login = catchErrors(async (req, res) => {
   console.log(req.session);
   const data = loginSchema.parse({
     ...req.body,
   });
  console.log(req.body)
    if (req.body.email && req.body.phoneNumber) {
      console.log("hackr")
      return res.status(403).json({
        success: false,
        message:
          "Something is wrong.",
      });
    }

  res.send("login route");
});

export const logout = async (req, res) => {
  res.send("logout route");
};
export const refresh = catchErrors(async (req, res) => {
  
  res.send("refresh route");
});
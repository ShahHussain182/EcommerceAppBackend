import jwt from "jsonwebtoken";
export const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve,reject) => {
        jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,payload) =>{
            if (err) {
                throw new Error();
            }
            
        })
    })
}
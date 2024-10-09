import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const accessTokenSecret = process.env.JWT_ACCESS_SECRET!;
const refreshTokenSecret = process.env.JWT_SECRET!;

// export const generateAccessToken = (userId: string) => {
//   return jwt.sign({ userId }, accessTokenSecret, { expiresIn: "15m" });
// };

// export const generateRefreshToken = (userId: string) => {
//   return jwt.sign({ userId }, refreshTokenSecret, { expiresIn: "7d" });
// };

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, accessTokenSecret);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, refreshTokenSecret);
};

export const generateAccessToken = (id: string, role: "user" | "admin") => {
  return jwt.sign({ id, role }, accessTokenSecret as string, {
    expiresIn: "15m", 
  });
};

export const generateRefreshToken = (id: string) => {
  try {
    return jwt.sign({ id }, refreshTokenSecret as string, {
      expiresIn: "7d",
    });
    
  } catch (error) {
    console.log('error creating jwt rt', error)
  }
};
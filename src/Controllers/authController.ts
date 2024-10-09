import { Request, Response } from "express";
import User from "../Models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../Utils/jwt";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // const accessToken = generateAccessToken(user.id, "user");
    // const refreshToken = generateRefreshToken(user.id);

    const accessToken = generateAccessToken(user.id, "user");
    console.log('Access token generated:', accessToken);
    
    const refreshToken = generateRefreshToken(user._id as string);
    console.log('Refresh token generated:', refreshToken);

     res.cookie('accessToken', accessToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 30 * 60 * 1000, 
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
     
    res.json({
      user: {
        accessToken,
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhotoUrl: user.imageURL,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token is required" });
    return;
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = generateAccessToken(admin.id, "admin");
    const refreshToken = generateRefreshToken(admin.id);

    res.json({
      accessToken,
      refreshToken,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
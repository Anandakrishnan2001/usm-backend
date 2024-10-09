import { Request, Response } from "express";
import User, { IUser } from "../Models/userModel";
import bcrypt from "bcrypt";
import { verifyAccessToken } from "../Utils/jwt";



export const registerUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { name, email, password, profilePhotoUrl } = req.body;
    const imageURL = profilePhotoUrl;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: IUser = new User({
      name,
      email,
      password: hashedPassword,
      imageURL,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUsers = async (req: any, res: any) => {
  try {
    const users = await User.find({ role: "user" });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfile = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    console.log(req.params,req.body,'is this is comming in the updateUserProfile')
    const { name, email, profilePhotoUrl } = req.body;
    const userId = id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, imageURL:profilePhotoUrl },
      { new: true }
    );
    console.log(updatedUser,'the updatedUser is comming')
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req: any, res: any) => {
  const userId = req.params.id;

  try {
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.sendStatus(401);
      return;
    }

    const decoded = verifyAccessToken(token);
    const userId = decoded;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.sendStatus(404);
      return;
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      imageURL: user.imageURL,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.sendStatus(500);
    return;
  }
};
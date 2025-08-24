import { User } from "../models/usermodel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { console } from "inspector";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    // const file = req.file;
    // console.log(fullname, email, phoneNumber, password, role);
    // console.log("FILE:", file);
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const file=req.file;
    const fileUri=getDataUri(file);
    const cloudResponse=await cloudinary.uploader.upload(fileUri.content,{ resource_type: 'raw',});

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile:{
        profilePhoto  :cloudResponse.secure_url,
      }
    });
    res.status(201).json({ message: "User created successfully", success: true });
  } catch (error) {
    console.error("Error in user registration:", error);

  }
}

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found", success: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password", success: false });
    }

    if (role !== user.role) {
      return res.status(403).json({ message: "Unauthorized access", success: false });
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

    // Prepare user data to return
    const sanitizedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile
    };

    return res.status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
      })
      .json({ message: `Welcome ${user.fullname}`, user: sanitizedUser, success: true });

  } catch (error) {
    console.error("Error in user login:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", {
      maxAge: 0,
    }).json({ message: "Logout successful", success: true });
  } catch (error) {
    console.error("Error in user logout:", error);
    ;
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    // console.log("Update Profile Data:", fullname, email, phoneNumber, bio, skills);
    const file = req.file;
    console.log(file);
    let fileUri, cloudResponse;
    if (file) {
      fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: 'raw',
      });
    }
    let skillsArray;
    if (skills) {
      skillsArray = skills.split(',');
    }

    const userId =req.user._id
    console.log("Authenticated user:", req.user);;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skill = skillsArray;


    // ✅ handle profile image upload
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile
    };

    return res.status(200).json({ message: "Profile updated successfully", user, success: true });

  } catch (error) {
    console.error("Error in updating profile:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
}
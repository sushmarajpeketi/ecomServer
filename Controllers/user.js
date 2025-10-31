import User from "../Models/UserSchema.js";
import jwt from "jsonwebtoken";
import {  z } from "zod";

let signUp = async (req, res) => {
  const signupSchema = z.object({
    username: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 4 characters"),
    mobile: z.coerce.number().int().max(9999999999).min(100000000),
  });

  const validation = signupSchema.safeParse(req.body);
  if (!validation.success) {
    console.log(validation);
    let errArr = validation.error.issues.map((e) => {
      return { message: e.path[0] + ": " + e.message };
    });
    return res.status(400).json({ error: errArr });
  }

  const { username, email, password, mobile } = validation.data;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: "Email already exists" });
  }
  try {
    let user = await User.create({ username, email, password, mobile });
    res.status(200).send({ message: "user is created successfully.", user });
  } catch (error) {
    console.log("error while creating the user", error.message);
    return res.status(400).send({ error: "error while creating the user" });
  }
};

let signIn = async (req, res) => {
  const signinSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 4 characters"), // add strong password with atleast 1digit/special cha/alpha
  });
  const validation = signinSchema.safeParse(req.body);
  if (!validation.success) {
    console.log(validation);
    let errArr = validation.error.issues.map((e) => {
      return { message: e.path[0] + ": " + e.message };
    });
    return res.status(400).json({ error: errArr });
  }

  const { email, password } = validation.data;
  try {
    let user = await User.findOne({ email, password });
    console.log("user from signin", user);
    if (!user) {
      console.log("user not found");
      return res.status(404).send({ error: "user not found!" });
    }
    let username = user.username;
    const token = jwt.sign(
      { id: user._id, username, email },
      process.env.SECRETKEY,
      {
        expiresIn: "1hr",
      }
    );
    res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    console.log("cookie was sent to user!");
    return res
      .status(200)
      .send({ message: "user logged in successfully!", user });
  } catch (error) {
    console.log("error while user login", error.message);
  }
};
const userInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "username email mobile role img"
    );
    const userObj = user.toObject();
    if (!userObj) {
      return res.status(401).send({ error: "User not found" });
    }
    res.status(200).send({ ...userObj, id: userObj._id, _id: undefined });
  } catch (error) {
    
    res.status(500).send({ error: error.message });
  }
};

const allUsers = async (req, res) => {
  console.log("all users API");

  User.aggregate([
    {
      $project: {
        id: "$_id",
        _id: 0,
        email: 1,
        username: 1,
        mobile: 1,
      },
    },
  ])
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((e) => {
      console.log(e.message);
      return res.status(400).json({ error: "error while fetching all users" });
    });
};

const dynamicUsers = async (req, res) => {
  let { page, rows, username, email,length } = req.query;
  console.log("hey");
  let queryObj = {};
  if (username) {
    console.log("username", username);
    queryObj["username"] = { $regex: username, $options: "i" };
  }
  if (email) {
    queryObj["email"] =  { $regex: email, $options: "i" } ;
  }
  // if (mobile) {
  //   mobile = bigint(mobile);
  //   queryObj["mobile"] = { $contains: { $regex: mobile, $options: "i" } };
  // }
  console.log("queryObj is", queryObj);

  console.log("page and rows and username and email",page," ",rows," ",username," ",email);
  page = parseInt(page);
  rows = parseInt(rows);
  const skip = page * rows;
  let count = 0;
  if(length){
    count = await User.find(queryObj).countDocuments()
  }
  const sortedUsers = await User.find(queryObj)
    .sort({ _id: 1 })
    .skip(skip)
    .limit(rows);
  res.status(200).json({users:sortedUsers,count});
};

const usersLength = async (req, res) => {
  let length = await User.countDocuments();
  return res.status(200).json(length);
};

const avtarUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imgUrl = req.file.path;

    await User.updateOne({ _id: req.user.id }, { $set: { img: imgUrl } });

    res
      .status(200)
      .json({ message: "Image uploaded successfully", url: imgUrl });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};


const editUser = async (req,res)=>{
  
}

const deleteUser = async (req,res)=>{

}

export {
  signUp,
  signIn,
  userInfo,
  allUsers,
  dynamicUsers,
  usersLength,
  avtarUpload,
  logout,
  editUser,
  deleteUser
};

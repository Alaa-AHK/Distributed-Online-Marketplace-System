import bcrypt from"bcrypt";
import { userModel}from "../../../db/models/user.model.js"
import jwt from"jsonwebtoken"
import { sendMail } from "../../utilities/email/sendEmail.js"

const emailsAdmin=["salmaramadan348@gmail.com","salma.ramadan.mohammed@gmail.com"]
const isAdmin = (email) => emailsAdmin.includes(email);

const getUser = async (req, res) => {
  try {
    if (!isAdmin(req.user.email)) {
      return res.status(403).json({ message: "You don't have access to view all users" });
    }

    const users = await userModel.find();
    res.json({ message: "All users:", users });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



const postUser = async (req, res) => {
  try {
    const { email, userName, password } = req.body; 
    let user = await userModel.findOne({ email });

    if (!user) {
      
      await userModel.collection.insertOne({
        userName: userName || "New Admin",
        email,
        password: password,
        role: "admin",
      });

      user = await userModel.findOne({ email });
    }

    if (!emailsAdmin.includes(email)) {
      emailsAdmin.push(email);
      user.role = "admin";
      await user.save();

      return res.status(201).json({
        message: "Admin added",
        emailsAdmin,
        user,
      });
    }

    res.status(400).json({ message: "This email is already admin" });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Server error", error });
  }
};

const updateUser=async(req,res)=>{
    try{
        const {id}=req.params
        const updatedUser=await userModel.findByIdAndUpdate(id,{...req.body},{new:true})
        res.json({message:"updated successful",updatedUser})
    }
    catch(error){
        res.status(500).json({ message: "Server error", error });
    }
    
}
const deleteUser=async (req,res)=>{
    try{
        if (!isAdmin(req.user.email))return res.status(403).json({ message: "You don't have access to delete user" });
        const {id}=req.params
        const deletedUser=await userModel.findByIdAndDelete(id)
        res.json({message:"deleted successful",deletedUser})
    }
    catch(error){
        res.status(500).json({ message: "Server error", error });
    }
}

const register = async (req, res) => {
  try {
    const { email, password, role: inputRole } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 8);

    let role = inputRole || "buyer";

    if (emailsAdmin.includes(email)) {
      role = "admin";
    }

    const userData = {
      ...req.body,
      password: hashedPassword,
      role
    };

    const addedUser = await userModel.create(userData);

    sendMail(email).catch((error) => {
      console.error("sendMail failed:", error?.message ?? error);
    });

    addedUser.password = undefined;

    return res.status(201).json({
      message: "register is successful",
      addedUser
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const login =async(req,res)=>{
    try{
    const exist=await userModel.findOne({email:req.body.email})
    if(!exist){
        return res.json({message:"email or password invalid"})
    }
    const matchPass=bcrypt.compareSync(req.body.password, exist.password)
    if(!matchPass){
      return res.status(401).json({message:"email or password invalid"})
}
    const token=jwt.sign({_id:exist._id,role:exist.role,email:exist.email},"Day4")//sign for hash //verfiy for check //decode for not hash
    res.json({message:`welecome ${exist.userName}`,token})
    }
    catch(error){
        res.status(500).json({ message: "Server error", error });
    }
    
}
const verifyAccount = async(req,res)=>{
      let {email} =  req.params
     
       jwt.verify(email, "NTIG13Mail", async(err,decoded)=>{
        
        
           if(err) return res.json({message:"invalid token",err})
        await userModel.findOneAndUpdate({email:decoded.email}, {isConfirmed:true})
         res.json({message:"confirmed successfully"})
       })
       

      
       
}

const getMe = async (req, res) => {
  try {
    // 1. get user id from token (auth middleware)
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 2. fetch user from DB
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. return profile
    return res.status(200).json({
      message: "User profile fetched successfully",
      user
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

export{
    getUser,
    postUser,
    updateUser,
    deleteUser,
    register,
    login,
    verifyAccount,
    isAdmin,
    getMe
}
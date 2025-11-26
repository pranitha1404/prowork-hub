const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req,res)=>{
  const {name,email,password,role} = req.body;
  const hash = await bcrypt.hash(password,10);
  const user = await User.create({name,email,password:hash,role});
  res.json(user);
};

exports.login = async (req,res)=>{
  const {email,password}=req.body;
  const user = await User.findOne({email});
  if(!user) return res.status(404).json({message:"User not found"});
  if(!await bcrypt.compare(password,user.password))
    return res.status(401).json({message:"Wrong password"});
  const token = jwt.sign({id:user._id,role:user.role},"SECRET123",{expiresIn:"1d"});
  res.json({token,user});
};

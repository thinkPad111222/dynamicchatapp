const CHAT = require("../models/Chat");
const USER = require("../models/User");
const bcrypt = require("bcrypt");
const loadRegisterUser = async (req, res) => {
  try {
    res.render("register");
  } catch (err) {
    console.log(err.message);
  }
};

const RegisterUser = async (req, res) => {
  try {
    const hashpass = await bcrypt.hash(req.body.password, 10);

    let user = new USER({
      name: req.body.name,
      email: req.body.email,
      image: "images/" + req.file.filename,
      password: hashpass,
    });
    user = await user.save();

    res.render("register", { data: user, message: "user created" });
  } catch (err) {
    console.log(err.message);
  }
};

const LoadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.log(err.message);
  }
};
const Login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (email) {
      const userData = await USER.find({ email: email });
      if (userData) {
        const checkpassword = await bcrypt.compare(
          password,
          userData[0].password
        );

        if (checkpassword) {
          req.session.user = userData[0];
          res.redirect("/dashboard");
        } else {
          res.render("login", { message: "password not match" });
        }
      } else {
        res.render("login", { message: "Invalid Email or password" });
      }
    }
  } catch (err) {
    console.log(err.message);
  }
};

const Logout = async (req, res) => {
  try {
    req.session.destroy();

    res.redirect("/");
  } catch (err) {
    console.log(err.message);
  }
};

const DashboardLoad =async (req, res) => {
  try{
  var users= await USER.find({_id:{$nin:[req.session.user._id]}})
    res.render("dashboard", { user: req.session.user ,users});

  }catch(err){console.log(err.message)}
};



const saveChat =async (req,res)=>{
   try{
    let chat=  new CHAT({
        sender_id:req.body.sender_id,
        receiver_id:req.body.receiver_id,
        message:req.body.message
      })
 
      chat = await chat.save();
     
    res.status(201).json({success:true,msg:"message send",chat})

   }catch(err){
    res.status(400).json({success:false,msg:err.message})
   }
}

const deleteChat=async(req,res)=>{
  try{
    let response=     await CHAT.deleteOne({_id:req.body.id});
    res.status(200).json({success:true,msg:"message deleted"})
  }catch(err){
    res.status(400).json({success:false,msg:err.message})
  }
}

const updateChat=async(req,res)=>{
  try{
    let response=await CHAT.findByIdAndUpdate({_id:req.body.id},{$set:{message:req.body.message}});
    res.status(200).json({success:true,msg:"message update",response})
  }catch(err){
    res.status(400).json({success:false,msg:err.message})
  }
}

module.exports = {
  loadRegisterUser,
  RegisterUser,
  LoadLogin,
  Login,
  Logout,
  DashboardLoad,
  saveChat,
  deleteChat,
  updateChat,
};

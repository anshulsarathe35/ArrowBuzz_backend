const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Service = require("../model/serviceModel");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     res.status(400);
//     throw new Error("Please fill in all required fileds");
//   }

//   const userExits = await User.findOne({ email });
//   if (userExits) {
//     res.status(400);
//     throw new Error("Email is already exit");
//   }

//   const user = await User.create({
//     name,
//     email,
//     password,
//   });

//   const token = generateToken(user._id);
//   res.cookie("token", token, {
//     path: "/",
//     httpOnly: true,
//     expires: new Date(Date.now() + 1000 * 86400), // 1 day
//     sameSite: "none",
//     secure: true,
//   });

//   if (user) {
//     const { _id, name, email, photo, role } = user;
//     res.status(201).json({ _id, name, email, photo, token, role });
//   } else {
//     res.status(400);
//     throw new Error("Invalid user data");
//   }
// });


//anshul - with multer 
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNo } = req.body;

  if (!name || !email || !password || !phoneNo) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email is already registered");
  }

  let photo = "";
  if (req.file) {
    photo = `/uploads/${req.file.filename}`;
  } else {
  
    photo = "/uploads/default-profile.png"; 
  }

  const user = await User.create({
    name,
    email,
    password,
    photo,
    phoneNo
  });

  const token = generateToken(user._id);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, photo, role,phoneNo } = user;
    res.status(201).json({ _id, name, email, photo, token, role,phoneNo });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please add Email and Password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found, Please signUp");
  }

  const passwordIsCorrrect = await bcrypt.compare(password, user.password);

  const token = generateToken(user._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user && passwordIsCorrrect) {
    const { _id, name, email, photo, role } = user;
    res.status(201).json({ _id, name, email, photo, role, token });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.status(200).json(user);
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
});


//raj get particular user
const getparticularuser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const particularUser = await User.findById(id).select("-password");

    if (!particularUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(particularUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user details", error });
  }
});

//raj update profile
// const updateprofile = asyncHandler(async(req,res)=>{
//   const { name, phoneNo, email, photo } = req.body;

//   const user = await User.findById(req.user.id);
//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }

  
//   user.name = name || user.name;
//   user.phoneNo = phoneNo || user.phoneNo;
//   user.email = email || user.email;
//   user.photo = photo || user.photo;

//   const updatedUser = await user.save();
//   res.status(200).json(updatedUser);
// });


//anshul new corrected route
const updateprofile = asyncHandler(async (req, res) => {
  const { name, phoneNo, email } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = name || user.name;
  user.phoneNo = phoneNo || user.phoneNo;
  user.email = email || user.email;

  if (req.file) {
    user.photo = `/uploads/${req.file.filename}`;
  }

  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});


/* const loginAsSeller = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please add Email and Password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found, Please signUp");
  }

  const passwordIsCorrrect = await bcrypt.compare(password, user.password);

  const token = generateToken(user._id);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  user.role = "seller";
  user.save();
  if (user && passwordIsCorrrect) {
    const { _id, name, email, photo, role } = user;
    res.status(201).json({ _id, name, email, photo, role, token });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
}); */
const loginAsCustomer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide both email and password");
  }

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found, please sign up");
  }


  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Invalid email or password");
  }


  user.role = "customer";
  await user.save();

 
  const token = generateToken(user._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });


  const { _id, name, email: userEmail, photo, role } = user;
  res.status(200).json({ _id, name, email: userEmail, photo, role, token });
});

const loginAsServicemen = asyncHandler(async (req, res) => {
  const { email, password } = req.body;


  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide both email and password");
  }


  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found, please sign up");
  }

 
  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  user.role = "servicemen";
  await user.save();

  const token = generateToken(user._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  const { _id, name, email: userEmail, photo, role } = user;
  res.status(200).json({ _id, name, email: userEmail, photo, role, token });
});

const loginAsAdmin = asyncHandler(async (req, res) => {
  const { email, password, adminsecret} = req.body;

  if (!email || !password ) {
    res.status(400);
    throw new Error("Please provide both email and password");
  }


  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found, please sign up");
  }


  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  user.role = "admin";
  await user.save();

  const token = generateToken(user._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  const { _id, name, email: userEmail, photo, role } = user;
  res.status(200).json({ _id, name, email: userEmail, photo, role, token });
});

const getUserBalance = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    balance: user.balance,
  });
});

// Only for admin users
const getAllUser = asyncHandler(async (req, res) => {
  const userList = await User.find({});

  if (!userList.length) {
    return res.status(404).json({ message: "No user found" });
  }

  res.status(200).json(userList);
});

const estimateIncome = asyncHandler(async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      return res.status(404).json({ error: "Admin user not found" });
    }
    const commissionBalance = admin.commissionBalance;
    res.status(200).json({ commissionBalance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = {
  registerUser,
  loginUser,
  loginStatus,
  logoutUser,
  loginAsCustomer,
  loginAsServicemen,
  loginAsAdmin,
  estimateIncome,
  getUser,
  getUserBalance,
  getAllUser,
  getparticularuser,
  updateprofile,
};

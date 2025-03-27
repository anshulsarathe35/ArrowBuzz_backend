//raj
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const protect = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, please login");
  }

  try {

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(verified.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401);
    throw new Error("Token is invalid or Session expired. Please login again.");
  }
});

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied. You are not an admin.");
  }
};

const isCustomer = (req, res, next) => {
  if (req.user && (req.user.role === "customer" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied. You are not a customer.");
  }
};

module.exports = { protect, isAdmin, isCustomer };




// anshul
// const expressAsyncHandler = require("express-async-handler");
// const jwt = require("jsonwebtoken");
// const User = require("../model/userModel");

// const protect = expressAsyncHandler(async (req, res, next) => {
//   try {
//     // old raj
//     // const token = req.cookies.token || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZGNmMmMyMWE4MWZkM2VlNDY0ZjQ0NCIsImlhdCI6MTc0MjY2NTMzOCwiZXhwIjoxNzQyNzUxNzM4fQ.-hS2aV46uDMqOx6FVDVmnWE5GSTrX_Ucvlk6Vluddqk";
    
//     const token = req.cookies.token ;
//     if (!token) {
//       res.status(401);
//       throw new Error("Not authorized, Please Login");
//     }
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(verified.id).select("-password");
//     if (!user) {
//       res.status(401);
//       throw new Error("User not found");
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401);
//     throw new Error("Not authorized, Please Login");
//   }
// });

// const isAdmin = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     next();
//   } else {
//     res.status(403);
//     throw new Error("Access denied. You are not an admin.");
//   }
// };

// const isCustomer = (req, res, next) => {
//   if (req.user && (req.user.role === "customer" || req.user.role === "admin")) {
//     next();
//   } else {
//     res.status(403);
//     throw new Error("Access denied. You are not a Customer.");
//   }
// };

// module.exports = { protect, isAdmin, isCustomer };

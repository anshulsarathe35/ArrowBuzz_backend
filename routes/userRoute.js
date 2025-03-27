const express = require("express");
const router = express.Router();
const multer = require("multer");
const { 
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
} = require("../controllers/userCtr");
const { protect, isAdmin } = require("../middleWare/authMiddleWare");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); 
  },
});

const upload = multer({ storage });
router.post("/register", upload.single("photo"), registerUser);


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/loggedin", loginStatus);
router.get("/logout", logoutUser);
router.post("/customer", loginAsCustomer);
router.post("/servicemen", loginAsServicemen);
router.post("/admin", loginAsAdmin);
router.get("/getuser", protect, getUser);
router.get("/sell-amount", protect, getUserBalance);

router.get("/estimate-income", protect, isAdmin, estimateIncome);
//anshul
// router.get("/users", protect, isAdmin, getAllUser);

//raj
// router.get("/allusers", protect, isAdmin, getAllUser);
router.get("/allusers", getAllUser);

//raj only for admin get user with id
router.get("/get-particularuser/:id",protect,getparticularuser);

//raj
router.put("/updateprofile/:id",protect,updateprofile);

module.exports = router;

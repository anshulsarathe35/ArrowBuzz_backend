const express = require("express");
const {
  createService,
  getAllServices,
  deleteService,
  updateService,
  getServiceById ,
  getAllServicesByAmdin,
  deleteServicesByAmdin,
  getAllSoldServices,
  verifyAndAddCommissionServiceByAmdin,
  getAllServicesofUser,
  getWonServices,
  //raj
  // getAllUsersByAmdin
} = require("../controllers/ServiceCtr");
const { upload } = require("../utils/fileUpload");
const { protect, isCustomer, isAdmin } = require("../middleWare/authMiddleWare");
const router = express.Router();

router.post("/", protect, isCustomer, upload.single("image"), createService);

router.delete("/:id", protect, isCustomer, deleteService);

router.put("/:id", protect, isCustomer, upload.single("image"), updateService);

router.get("/", getAllServices);

router.get("/user", protect, getAllServicesofUser);

router.get("/won-services", protect, getWonServices);

router.get("/sold", getAllSoldServices);

router.get("/:id", getServiceById);


router.put("/admin/service-verified/:id", protect, isAdmin, verifyAndAddCommissionServiceByAmdin);

//anshul
// router.get("/admin/services", protect, isAdmin, getAllServicesByAmdin);

//raj
router.get("/admin/services", getAllServicesByAmdin);

//anshul
// router.delete("/admin/services", protect, isAdmin, deleteServicesByAmdin);


//raj
router.delete("/admin/delservices", protect, isAdmin, deleteServicesByAmdin);


//raj
// router.get("/admin/allusers", protect, isAdmin, getAllUsersByAmdin);

module.exports = router;

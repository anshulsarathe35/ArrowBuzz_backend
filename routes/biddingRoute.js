const express = require("express");
const { placeBid, getBiddingHistory, sellService, } = require("../controllers/biddingCtr");
const { protect, isCustomer } = require("../middleWare/authMiddleWare");
const router = express.Router();

router.get("/:serviceId", getBiddingHistory);

//anshul
router.post("/sell", protect, isCustomer, sellService);

router.post("/", protect, placeBid);

//raj
// router.get("/soldToName",soldToName)

module.exports = router;

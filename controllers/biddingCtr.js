const asyncHandler = require("express-async-handler");
const Service = require("../model/serviceModel");
const BiddingService = require("../model/biddingServiceModel");
const sendEmail = require("../utils/sendEmail");
const User = require("../model/userModel");




const placeBid = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user || user.role !== "servicemen") {
    res.status(403);
    throw new Error("Access denied. Only servicemen can place bids.");
  }

  const { serviceId, price } = req.body;

  // Fetch the service
  const service = await Service.findById(serviceId);
  if (!service) {
    res.status(400);
    throw new Error("Service not found.");
  }


  if (!service.isverify) {
    res.status(403);
    throw new Error("Bidding is not allowed. Service is not verified.");
  }

  
  if (service.isSoldout === true) {
    res.status(400);
    throw new Error("Bidding is closed for this service.");
  }

 
  if (service.user.toString() === userId) {
    res.status(403);
    throw new Error("You cannot place a bid on your own service.");
  }


  if (price <= 0) {
    res.status(400);
    throw new Error("Bid amount must be a positive number.");
  }

  const originalPrice = service.price;
  if (price <= originalPrice) {
    res.status(400);
    throw new Error("Your bid must be higher than the original price.");
  }

  const biddingService = await BiddingService.create({
    user: userId,
    service: serviceId,
    price,
  });

  res.status(201).json(biddingService);
});



const getBiddingHistory = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  const biddingHistory = await BiddingService.find({ service: serviceId }).sort("-createdAt").populate("user").populate("service");

  res.status(200).json(biddingHistory);
});

//raj
// const soldToName = asyncHandler(async(req,res)=>{
//   const 
// })




//raj
const sellService = asyncHandler(async (req, res) => {
  const { serviceId, bidderId } = req.body;
  const userId = req.user.id;

  // Find the service
  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }

  // Check if the user is authorized to sell the service
  if (service.user.toString() !== userId) {
    return res.status(403).json({ error: "You do not have permission to sell this service" });
  }

  // Find the selected bid
  const selectedBid = await BiddingService.findById(bidderId).populate("user");
  if (!selectedBid || selectedBid.service.toString() !== serviceId) {
    return res.status(400).json({ error: "Invalid bid for this service" });
  }

  // Calculate commission and final price
  const commissionRate = service.commission;
  const commissionAmount = (commissionRate / 100) * selectedBid.price;
  const finalPrice = selectedBid.price - commissionAmount;

  // Update service details
  service.isSoldout = true;
  service.soldTo = selectedBid.user;
  console.log(selectedBid.user.name);
  service.soldPrice = finalPrice;


  // console.log("service: ",service.soldToName);
  service.soldToName = selectedBid.user.name;
  //new raj
  // service.soldToName = await User.findOne()

  // Update admin's commission balance
  const admin = await User.findOne({ role: "admin" });
  if (admin) {
    admin.commissionBalance += commissionAmount;
    await admin.save();
  }

  // Update seller's balance
  const seller = await User.findById(service.user);
  if (seller) {
    seller.balance += finalPrice;
    await seller.save();
  } else {
    return res.status(404).json({ error: "Seller not found" });
  }

  // Save service
  await service.save();

  // Send email notification to the selected bidder
  await sendEmail({
    email: selectedBid.user.email,
    subject: "Congratulations! You won the auction!",
    text: `You have won the auction for "${service.title}" with a bid of $${selectedBid.price}.`,
  });

  res.status(200).json({ message: "Service has been successfully sold!" });
});





//anshul
// const sellService = asyncHandler(async (req, res) => {
//   const { serviceId } = req.body;
//   const userId = req.user.id;

//   // Find the service
//   const service = await Service.findById(serviceId);
//   if (!service) {
//     return res.status(404).json({ error: "Service not found" });
//   }

//   //   /* const currentTime = new Date();
//   //   const tenMinutesAgo = new Date(currentTime - 2 * 60 * 1000); // 10 minutes ago

//   //     if (!service.isSoldout || service.updatedAt < tenMinutesAgo || service.createdAt < tenMinutesAgo) {
//   //     return res.status(400).json({ error: "Service cannot be sold at this time" });
//   //   } */

//   // Check if the user is authorized to sell the service
//   if (service.user.toString() !== userId) {
//     return res.status(403).json({ error: "You do not have permission to sell this service" });
//   }

//   // Find the highest bid
//   const highestBid = await BiddingService.findOne({ service: serviceId }).sort({ price: -1 }).populate("user");
//   if (!highestBid) {
//     return res.status(400).json({ error: "No winning bid found for the service" });
//   }

//   // Calculate commission and final price
//   const commissionRate = service.commission;
//   const commissionAmount = (commissionRate / 100) * highestBid.price;
//   const finalPrice = highestBid.price - commissionAmount;

//   // Update service details
//   service.isSoldout = true;
//   service.soldTo = highestBid.user;
//   service.soldPrice = finalPrice;

//   // Update admin's commission balance
//   const admin = await User.findOne({ role: "admin" });
//   if (admin) {
//     admin.commissionBalance += commissionAmount;
//     await admin.save();
//   }

//   // Update seller's balance
//   const seller = await User.findById(service.user);
//   if (seller) {
//     seller.balance += finalPrice; // Add the remaining amount to the seller's balance
//     await seller.save();
//   } else {
//     return res.status(404).json({ error: "Seller not found" });
//   }

//   // Save service
//   await service.save();

//   // Send email notification to the highest bidder
//   await sendEmail({
//     email: highestBid.user.email,
//     subject: "Congratulations! You won the auction!",
//     text: `You have won the auction for "${service.title}" with a bid of $${highestBid.price}.`,
//   });

//   res.status(200).json({ message: "Service has been successfully sold!" });
// });

module.exports = {
  placeBid,
  getBiddingHistory,
  sellService,
};

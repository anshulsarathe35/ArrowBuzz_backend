const asyncHandler = require("express-async-handler");
const Service = require("../model/serviceModel");
const slugify = require("slugify");
const BiddingService = require("../model/biddingServiceModel");
const User = require("../model/userModel");
const cloudinary = require("cloudinary").v2;

//raj
// const createService = asyncHandler(async (req, res) => {
//   const {
//     title,
//     description,
//     price,
//     category,
//     auctionDays,
//     auctionHours,
//     auctionMinutes,

//     userName,
//   } = req.body;
//   const userId = req.user.id;
//   console.log(req.body);
//   // Slug generation
//   const originalSlug = slugify(title, {
//     lower: true,
//     remove: /[*+~.()'"!:@]/g,
//     strict: true,
//   });

//   let slug = originalSlug;
//   let suffix = 1;
//   while (await Service.findOne({ slug })) {
//     slug = `${originalSlug}-${suffix}`;
//     suffix++;
//   }

//   // Validation
//   if (!title || !description || !price || !userName) {
//     res.status(400);
//     throw new Error("Please fill in all fields");
//   }

//   // File upload to Cloudinary (if image exists)
//   let fileData = {};
//   if (req.file) {
//     try {
//       const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
//         folder: "Bidding/Service",
//         resource_type: "image",
//       });

//       fileData = {
//         fileName: req.file.originalname,
//         filePath: uploadedFile.secure_url,
//         fileType: req.file.mimetype,
//         public_id: uploadedFile.public_id,
//       };
//     } catch (error) {
//       res.status(500);
//       throw new Error("Image could not be uploaded");
//     }
//   }

//   // Create Service
//   const service = await Service.create({
//     user: userId,
//     title,
//     slug,
//     description,
//     price,
//     category,
//     userName,
//     auctionDays: auctionDays || 0,
//     auctionHours: auctionHours || 0,
//     auctionMinutes: auctionMinutes || 0,
//     image: fileData,
//   });

//   res.status(201).json({
//     success: true,
//     data: service,
//   });
// });



const createService = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    category,
    auctionDays,
    auctionHours,
    auctionMinutes,
    userName,
  } = req.body;

  const userId = req.user.id;

  if (!title || !description || !price || !userName) {
    res.status(400);
    throw new Error("Please fill in all fields.");
  }

  if (isNaN(price) || price <= 0) {
    res.status(400);
    throw new Error("Price must be a valid positive number.");
  }

  const originalSlug = slugify(title, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });

  let slug = originalSlug;
  let suffix = 1;

  while (await Service.findOne({ slug })) {
    slug = `${originalSlug}-${suffix}`;
    suffix++;
  }
  let fileData = {};
  if (req.file) {
    fileData = {
      fileName: req.file.originalname,
      filePath: req.file.path.replace(/\\/g, "/"), 
      fileType: req.file.mimetype,
    };
  }


  try {
    const service = await Service.create({
      user: userId,
      title,
      slug,
      description,
      price: parseFloat(price),
      category,
      userName,
      auctionDays: auctionDays || 0,
      auctionHours: auctionHours || 0,
      auctionMinutes: auctionMinutes || 0,
      image: fileData,
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("Error creating service:", error.message);
    res.status(500);
    throw new Error("Service creation failed.");
  }
});






//anshul
// const createService = asyncHandler(async (req, res) => {
//   const { title, description, price, category, height, lengthpic, width, mediumused, weigth } = req.body;
//   const userId = req.user.id;

//   const originalSlug = slugify(title, {
//     lower: true,
//     remove: /[*+~.()'"!:@]/g,
//     strict: true,
//   });

//   let slug = originalSlug;
//   let suffix = 1;

//   while (await Service.findOne({ slug })) {
//     slug = `${originalSlug}-${suffix}`;
//     suffix++;
//   }

//   if (!title || !description || !price) {
//     res.status(400);
//     throw new Error("Please fill in all fields");
//   }

//   let fileData = {};
//   if (req.file) {
//     let uploadedFile;
//     try {
//       uploadedFile = await cloudinary.uploader.upload(req.file.path, {
//         folder: "Bidding/Service",
//         resource_type: "image",
//       });
//     } catch (error) {
//       res.status(500);
//       throw new Error("Image could not be uploaded");
//     }

//     fileData = {
//       fileName: req.file.originalname,
//       filePath: uploadedFile.secure_url,
//       fileType: req.file.mimetype,
//       public_id: uploadedFile.public_id,
//     };
//   }

//   const service = await Service.create({
//     user: userId,
//     title,
//     slug: slug,
//     description,
//     price,
//     category,
//     height,
//     lengthpic,
//     width,
//     mediumused,
//     weigth,
//     image: fileData,
//   });
//   res.status(201).json({
//     success: true,
//     data: service,
//   });
// });

const getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find({}).sort("-createdAt").populate("user");

  const servicesWithDetails = await Promise.all(
    services.map(async (service) => {
      const latestBid = await BiddingService.findOne({ service: service._id }).sort("-createdAt");
      const biddingPrice = latestBid ? latestBid.price : service.price;

      const totalBids = await BiddingService.countDocuments({ service: service._id });

      return {
        ...service._doc,
        biddingPrice,
        totalBids, 
      };
    })
  );

  res.status(200).json(servicesWithDetails);
});

// const getAllUsersByAmdin = asyncHandler(async (req, res) => {
//   const allUsers = await User.find({}).sort("-createdAt");

//   res.status(200).json(allUsers);
// });


const getAllServicesofUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const services = await Service.find({ user: userId }).sort("-createdAt").populate("user");

  const servicesWithPrices = await Promise.all(
    services.map(async (service) => {
      const latestBid = await BiddingService.findOne({ service: service._id }).sort("-createdAt");
      const biddingPrice = latestBid ? latestBid.price : service.price;
      return {
        ...service._doc,
        biddingPrice, 
      };
    })
  );

  res.status(200).json(servicesWithPrices);
});

const getWonServices = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const wonServices = await Service.find({ soldTo: userId }).sort("-createdAt").populate("user");

  const servicesWithPrices = await Promise.all(
    wonServices.map(async (service) => {
      const latestBid = await BiddingService.findOne({ service: service._id }).sort("-createdAt");
      const biddingPrice = latestBid ? latestBid.price : service.price;
      return {
        ...service._doc,
        biddingPrice,
      };
    })
  );

  res.status(200).json(servicesWithPrices);
});

const getAllSoldServices = asyncHandler(async (req, res) => {
  const service = await Service.find({ isSoldout: true }).sort("-createdAt").populate("user");
  res.status(200).json(service);
});

//raj
// Get a single service by ID
const getServiceById  = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // console.log("debugging backend: ",id);
  try {
    const service = await Service.findById(id);
    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//anshul
// const getServiceBySlug = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const service = await Service.findById(id);
//   if (!service) {
//     res.status(404);
//     throw new Error("Service not found");
//   }
//   res.status(200).json(service);
// });


const deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const service = await Service.findById(id);

  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }
  if (service.user?.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  if (service.image && service.image.public_id) {
    try {
      await cloudinary.uploader.destroy(service.image.public_id);
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
  }

  await Service.findByIdAndDelete(id);
  res.status(200).json({ message: "Service deleted." });
});


//raj
const updateService = asyncHandler(async (req, res) => {
  const { title, category, description, price, auctionDays, auctionHours, auctionMinutes } = req.body;
  const { id } = req.params;
  const service = await Service.findById(id);

  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }
  if (service.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  let fileData = {};
  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Service-Images",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    if (service.image && service.image.public_id) {
      try {
        await cloudinary.uploader.destroy(service.image.public_id);
      } catch (error) {
        console.error("Error deleting previous image from Cloudinary:", error);
      }
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      public_id: uploadedFile.public_id,
    };
  }

  const updatedService = await Service.findByIdAndUpdate(
    { _id: id },
    {
      title,
      category,
      description,
      price,
      auctionDays,
      auctionHours,
      auctionMinutes,
      image: Object.keys(fileData).length === 0 ? service.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedService);
});


//anshul
// const updateService = asyncHandler(async (req, res) => {
//   const { title, description, price, height, lengthpic, width, mediumused, weigth } = req.body;
//   const { id } = req.params;
//   const service = await Service.findById(id);

//   if (!service) {
//     res.status(404);
//     throw new Error("Service not found");
//   }
//   if (service.user.toString() !== req.user.id) {
//     res.status(401);
//     throw new Error("User not authorized");
//   }

//   let fileData = {};
//   if (req.file) {
//     let uploadedFile;
//     try {
//       uploadedFile = await cloudinary.uploader.upload(req.file.path, {
//         folder: "Service-Images",
//         resource_type: "image",
//       });
//     } catch (error) {
//       res.status(500);
//       throw new Error("Image colud not be uploaded");
//     }

//     if (service.image && service.image.public_id) {
//       try {
//         await cloudinary.uploader.destroy(service.image.public_id);
//       } catch (error) {
//         console.error("Error deleting previous image from Cloudinary:", error);
//       }
//     }
//     //step 1 :
//     fileData = {
//       fileName: req.file.originalname,
//       filePath: uploadedFile.secure_url,
//       fileType: req.file.mimetype,
//       public_id: uploadedFile.public_id,
//     };
//   }

//   const updatedService = await Service.findByIdAndUpdate(
//     { _id: id },
//     {
//       title,
//       description,
//       price,
//       height,
//       lengthpic,
//       width,
//       mediumused,
//       weigth,
//       image: Object.keys(fileData).length === 0 ? Service?.image : fileData,
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   res.status(200).json(updatedService);
// });

// for admin only users
//raj
const verifyAndAddCommissionServiceByAmdin = asyncHandler(async (req, res) => {
  const { commission, isverify } = req.body;  
  const { id } = req.params;

  const service = await Service.findById(id);
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  service.isverify = isverify;
  service.commission = commission;

  await service.save();

  res.status(200).json({ message: "Service updated successfully", data: service });
});






//anshul
// const verifyAndAddCommissionServiceByAmdin = asyncHandler(async (req, res) => {
//   const { commission } = req.body;
//   const { id } = req.params;

//   const service = await Service.findById(id);
//   if (!service) {
//     res.status(404);
//     throw new Error("Service not found");
//   }

//   service.isverify = true;
//   service.commission = commission;

//   await service.save();

//   res.status(200).json({ message: "Service verified successfully", data: service });
// });




const getAllServicesByAmdin = asyncHandler(async (req, res) => {
  const services = await Service.find({}).sort("-createdAt").populate("user");

  const servicesWithPrices = await Promise.all(
    services.map(async (service) => {
      const latestBid = await BiddingService.findOne({ service: service._id }).sort("-createdAt");
      const biddingPrice = latestBid ? latestBid.price : service.price;
      return {
        ...service._doc,
        biddingPrice,
      };
    })
  );

  res.status(200).json(servicesWithPrices);
});


// dot not it
const deleteServicesByAmdin = asyncHandler(async (req, res) => {
  try {
    const { serviceIds } = req.body;

    const result = await Service.findOneAndDelete({ _id: serviceIds });

    res.status(200).json({ message: `${result.title} services deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//undefined services deleted successfully
module.exports = {
  createService,
  getAllServices,
  getWonServices,
  getServiceById,
  deleteService,
  updateService,
  verifyAndAddCommissionServiceByAmdin,
  getAllServicesByAmdin,
  deleteServicesByAmdin,
  getAllSoldServices,
  getAllServicesofUser,
  // getAllUsersByAmdin
};

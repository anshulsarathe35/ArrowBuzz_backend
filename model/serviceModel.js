//raj
const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    title: {
      type: String,
      require: [true, "Please add a title"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    image: {
      type: Object,
      default: {},
    },
    category: {
      type: String,
      required: [true, "Post category is required"],
      default: "All",
    },
    commission: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      require: [true, "Please add a Price"],
    },
    isverify: {
      type: Boolean,
      default: false,
    },
    isSoldout: {
      type: Boolean,
      default: false,
    },
    soldTo: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    soldToName:{
      type:String,
      default:"No One"
    },
    userName:{
      type:String,
      default:"User"
    },
    // New fields for auction duration
    auctionDays: {
      type: Number,
      default: 0,
    },
    auctionHours: {
      type: Number,
      default: 0,
    },
    auctionMinutes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;



//anshul
// const mongoose = require("mongoose");

// const serviceSchema = mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       require: true,
//       ref: "User",
//     },
//     title: {
//       type: String,
//       require: [true, "Please add a title"],
//       trime: true,
//     },
//     slug: {
//       type: String,
//       unique: true,
//     },
//     description: {
//       type: String,
//       required: [true, "Please add a description"],
//       trime: true,
//     },
//     image: {
//       type: Object,
//       default: {},
//     },
//     category: {
//       type: String,
//       required: [true, "Post category is required"],
//       default: "All",
//     },
//     commission: {
//       type: Number,
//       default: 0,
//     },
//     price: {
//       type: Number,
//       require: [true, "Please add a Price"],
//     },
//     height: {
//       type: Number,
//     },
//     lengthpic: {
//       type: Number,
//     },
//     width: {
//       type: Number,
//     },
//     mediumused: {
//       type: String,
//     },
//     weigth: {
//       type: Number,
//     },
//     isverify: {
//       type: Boolean,
//       default: false,
//     },
//     isSoldout: {
//       type: Boolean,
//       default: false,
//     },
//     soldTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );
// const service = mongoose.model("Service", serviceSchema);
// module.exports = service;

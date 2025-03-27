const mongoose = require("mongoose");

const BiddingServiceSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Service",
    },
    price: {
      type: Number,
      require: [true, "Please add a Price"],
    },
  },
  { timestamps: true }
);
const biddingservice = mongoose.model("BiddingProduct", BiddingServiceSchema);
module.exports = biddingservice;

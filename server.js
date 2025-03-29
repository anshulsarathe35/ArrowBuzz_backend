const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/userRoute");
const serviceRoute = require("./routes/serviceRoute");
const biddingRoute = require("./routes/biddingRoute");
const categoryRoute = require("./routes/categoryRoute");
// const contactUsRoute = require("./routes/contactUsRoute")
const errorHandler = require("./middleWare/errorMiddleWare");
const User = require("./model/userModel");

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

//Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/service", serviceRoute);
app.use("/api/bidding", biddingRoute);
app.use("/api/category", categoryRoute);

//just for contact us page
// app.use("/api/contactus", contactUsRoute)

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Erro Middleware
app.use(errorHandler);

// Routes
app.get("/", (req, res) => {
  res.send("Home Pages");
});

//connect to mongoose
mongoose
  .connect(process.env.DATABASE_CLOUD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

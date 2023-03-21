const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const PORT = process.env.port || 4000;
const connectDB = require("./config/dbConn");

//connect to mongoDB
connectDB();
//custom logger middleware
app.use(logger);
//apply cors cross-origin-resource-sharing
app.use(cors(corsOptions));
//middleware is to handle form data
app.use(express.urlencoded({ extended: false }));
//middleware for json
app.use(express.json());
//middleware for cookies
app.use(cookieParser());
//middleware for serving static files
app.use(express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
//refresh token
app.use("/refresh", require("./routes/refresh"));
//logout
app.use("/logout", require("./routes/logout"));
//everything below this line will verify each api call with the jwt access token
app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.use(errorHandler);

//this logic checks if mongodb is connected, if so, then the app listens to port
mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

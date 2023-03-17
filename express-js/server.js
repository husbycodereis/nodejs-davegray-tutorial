const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");

const PORT = process.env.port || 4000;
//custom logger middleware
app.use(logger);
//apply cors cross-origin-resource-sharing
const whitelist = ["https://www.codereis.com", "https://codereis.com"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("not allowed by cors"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
//middleware is to handle form data
app.use(express.urlencoded({ extended: false }));
//middleware for json
app.use(express.json());
//middleware for serving static files
app.use(express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));
app.use("/employees", require("./routes/api/employees"));

//Route Handlers
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("hello yukluyoruz");
    next();
  },
  (req, res) => {
    res.send("Hello canim benim");
  }
);
app.all("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.use(errorHandler);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

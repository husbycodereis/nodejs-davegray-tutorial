const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.port || 4000;

//middleware is to handle form data
app.use(express.urlencoded({ extended: false }));
//middleware for json
app.use(express.json);
//middleware for serving static files
app.use(express.static(path.join(__dirname, "/public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});
app.get("/old-page(.html)?", (req, res) => {
  res.redirect("/new-page.html");
});

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
app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

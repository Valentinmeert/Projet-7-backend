const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const userRoutes = require("./routes/users");
const userPosts = require("./routes/posts");
const userReacts = require("./routes/reacts");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", userPosts);
app.use("/api/v1/post", userReacts);

module.exports = app;

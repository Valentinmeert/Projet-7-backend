const jwt = require("jsonwebtoken");
const Post = require("../helpers/posts");
const User = require("../helpers/users");
const { sequelize } = require("../models");
var fs = require("fs");

exports.createPost = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const { userId } = decodedToken;
  if (req.files) {
    console.log("path", req.files.file.path);
    var oldpath = req.files.file.path;
    var newpath =
      "/mnt/c/Users/valen/OneDrive/Bureau/P7_Meert_Valentin/backend/images/" +
      req.files.file.name;
    fs.renameSync(oldpath, newpath);
    /*     var oldpath = req.files.filetoupload.path;
    var newpath = "C:/Users/Your Name/" + files.filetoupload.name;
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      res.write("File uploaded and moved!");
      res.end();
    }); */
  }
  const post = new Post({
    userId,
    title: req.fields.title,
    content: req.fields.content,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.files.file.name
    }`,
  });
  post
    .save()
    .then(() => res.status(201).json({ message: "Post enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllPosts = (req, res) => {
  Post.findAll({ order: [["createdAt", "DESC"]] })
    .then((post) => {
      res.status(200).send(post);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getOnePost = (req, res) => {
  Post.findOne({ where: { id: req.params.postId } })
    .then((post) => {
      if (post) {
        console.log(post.userId);
        res.status(200).send(post);
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifyPost = async (req, res) => {
  Post.update({ ...req.body }, { where: { id: req.params.id } })
    .then(() => {
      res.status(201).json({ message: "Post modifié !" });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deletePost = (req, res) => {
  Post.destroy({ where: { id: req.params.id } })
    .then(() => {
      res.status(200).json({ message: "Post supprimé !" });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getUserIdWithPost = (req, res) => {
  sequelize
    .query("SELECT *  FROM users INNER JOIN posts ON users.id = posts.userId")
    .then((res) => {
      console.log(res);
    });
};

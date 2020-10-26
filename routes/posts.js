const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const postCtrl = require("../controllers/posts");

router.post("/", auth, multer, postCtrl.createPost);
router.get("/root", auth, postCtrl.getAllPosts);
router.get("/:postId", auth, postCtrl.getOnePost);
router.delete("/:id", auth, postCtrl.deletePost);
router.put("/:id", auth, multer, postCtrl.modifyPost);
router.get("/root/:postId", auth, postCtrl.getUserIdWithPost);

module.exports = router;

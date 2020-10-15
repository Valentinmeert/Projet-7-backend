const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const postCtrl = require("../controllers/posts");

router.post("/", auth, postCtrl.createPost);
router.get("/root", postCtrl.getAllPosts);
router.get("/:postId", postCtrl.getOnePost);
router.delete("/:id", postCtrl.deletePost);
router.put("/:id", postCtrl.modifyPost);
router.get("/root/:postId", postCtrl.getUserIdWithPost);

module.exports = router;
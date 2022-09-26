const router = require("express").Router()
const postController = require("../controllers/posts")

router.get("/", postController.getAllPosts)

router.get("/:id", postController.getPostById)

router.get("/getPostByUser", postController.getPostByUser)

router.patch("/edit/:id", postController.editPost)

router.delete("/delete/:id", postController.deletePost)

router.post("/add", postController.addPost)

module.exports = router
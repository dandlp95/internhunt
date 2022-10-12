const router = require("express").Router()
const postController = require("../controllers/posts")

router.get("/", postController.getAllPosts)

router.get("/getById/:id", postController.getPostById)

router.get("/getPostByUser", postController.getPostByUser)

router.patch("/edit/:id", postController.editPost)

router.delete("/delete/:id", postController.deletePost)

router.post("/add/", postController.addPost)

router.get("/getPostsByDepartment", postController.getPostsByDepartment)

//router.get("/getPostsByMajor/:major", postController.getPostsByMajor)

router.get("/getPostsByMajor/:major", postController.getPostsByMajor)

module.exports = router
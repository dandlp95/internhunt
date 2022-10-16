const router = require("express").Router()
const postController = require("../controllers/posts")
const {getAuthToken} = require("../middleware/auth")

router.get("/getById/:id", postController.getPostById)

router.get("/getPostByUser/:id", postController.getPostByUser)

router.patch("/edit/:id", getAuthToken,postController.editPost)

router.delete("/delete/:id", getAuthToken, postController.deletePost)

router.post("/add", getAuthToken, postController.addPost)

router.get("/getPostsByDepartment", postController.getPostsByDepartment)

router.get("/getPosts", postController.getPosts)

module.exports = router
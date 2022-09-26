const router = require("express").Router()
const commentController = require("../controllers/comments")

router.get("/", commentController.getAllComments)

router.get("/:id", commentController.getCommentById)

router.get("/getByPost/:id", commentController.getCommentByPost)

router.get("/getByUser/:id", commentController.getCommentByUser)

router.patch("/edit/:id", commentController.editComment)

router.delete("/delete/:id", commentController.deleteComment)

router.post("/add", commentController.addComment)

module.exports = router
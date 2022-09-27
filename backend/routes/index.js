const router = require("express").Router();

router.use("/users", require("./users"))

router.use("/posts", require("./comments"))

router.use("/comments", require("./posts"))

router.use("/majors", require("./majors"))

module.exports = router;
const router = require("express").Router();

router.use("/users", require("./users"))

router.use("/posts", require("./posts"))

router.use("/comments", require("./comments"))

router.use("/majors", require("./majors"))

router.use("/votingHistory", require("./votingHistory"))

module.exports = router;
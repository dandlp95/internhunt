const router = require("express").Router();
const controller = require("../controllers/majors");

router.get("/", controller.getMajors);

router.get("/:id", controller.getMajor);

router.post("/add", controller.addMajor);

module.exports = router;

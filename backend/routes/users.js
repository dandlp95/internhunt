const router = require("express").Router();
const userController = require("../controllers/users");
const isAuth = require("../middleware/auth");

router.get("/", userController.getAllUsers);

router.get("/isAuthorized", isAuth.getAuthToken, userController.isLoggedIn);

router.get("/getById/:id", userController.getUserById);

router.patch("/edit/:id", userController.editUser);

router.delete("/delete/:id", userController.deleteUser);

router.post("/add", userController.addUser);

router.post("/login", userController.login);

router.patch("/warn/:id", userController.warnUser);

router.patch("/suspend/:id", userController.suspendUser);

router.patch("/removeSuspension/:id", userController.removeSuspension);

module.exports = router;

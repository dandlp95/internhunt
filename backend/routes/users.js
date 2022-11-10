const router = require("express").Router();
const userController = require("../controllers/users");
const isAuth = require("../middleware/auth");

router.get("/", userController.getAllUsers);

router.get("/isAuthorized", isAuth.getAuthToken, userController.isLoggedIn);

router.get("/getById/:id", userController.getUserById);

router.get(
  "/getByIdPrivate/:id",
  isAuth.getAuthToken,
  userController.getUserByIdPrivate
);

router.patch("/edit/:id", isAuth.getAuthToken, userController.editUser);

router.delete("/delete/:id", isAuth.getAuthToken, userController.deleteUser);

router.post("/add", userController.addUser);

router.post("/login", userController.login);

router.post("/handleGoogleAuth", userController.handleGoogleLogin);

router.patch("/warn/:id", isAuth.getAuthToken, userController.warnUser);

router.patch("/suspend/:id", isAuth.getAuthToken, userController.suspendUser);

router.patch(
  "/removeSuspension/:id",
  isAuth.getAuthToken,
  userController.removeSuspension
);

router.patch(
  "/edit-password/:id",
  isAuth.getAuthToken,
  userController.editPassword
);

router.patch("/request-password-reset", userController.requestPasswordReset);

module.exports = router;

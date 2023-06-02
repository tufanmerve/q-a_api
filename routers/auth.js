const express = require("express");
const { register, login, authError, getUser, logout, uploadImage, forgotPassword ,resetPassword} = require("../controllers/auth");
const { getAccessToRoute } = require("../middlewares/authorization/auth");
const profileImageUpdate = require("../middlewares/libraries/profileImageUpload");

const router = express.Router();


router.post("/register", register)
router.post("/login", login)
router.get("/logout", getAccessToRoute, logout)
router.get("/error", authError)
router.get("/profile", getAccessToRoute, getUser)
router.post("/imageUpload", [getAccessToRoute, profileImageUpdate.single("profile_img")], uploadImage)
router.post("/forgotpassword", forgotPassword),
router.put("/resetpassword", resetPassword)


module.exports = router;
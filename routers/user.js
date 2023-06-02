const express = require("express");
const { getSingleUser, getAllUsers } = require("../controllers/user");
const router = express.Router();
const {checkUserExist} = require("../middlewares/database/databaseErrorHelper")

router.get("/:id", checkUserExist, getSingleUser);
router.get("/", getAllUsers)

module.exports = router;

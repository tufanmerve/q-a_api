const express = require("express");
const router = express.Router();
const auth = require("./auth");
const question = require("./question")
const user = require("./user")

router.use("/auth", auth);
router.use("/question", question);
router.use("/users", user)

module.exports = router;
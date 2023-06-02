const express = require("express");
const { getallQuestion } = require("../controllers/question");

const router = express.Router();

router.use("/", getallQuestion)

// router.get("/delete",(req,res)=>{
//     res.send("Question Delete")
// })



module.exports = router
const express = require("express");
const dotenv = require("dotenv");
const routers = require("./routers")
const connectDatabase = require("./helpers/database/connectDatabase");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const path = require("path")


//Env Variables
dotenv.config({
    path: "./config/env/config.env"
})

//MongoDb Connection
connectDatabase();
const PORT = process.env.PORT;


const app = express();


//Express-Body Middleware (gönderilen json verileri req body de yer alacak  )
app.use(express.json())


app.get("/", (req, res) => {
    res.send("hello sir");

})


//Router Middleware
app.use("/api", routers)


//Error Handler
app.use(customErrorHandler)


//Static files
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT} : ${process.env.NODE_ENV}`);
})

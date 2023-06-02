const CustomError = require("../../helpers/errors/CustomError");

const customErrorHandler = (err, req, res, next) => {
    let customError = err;


    if (err.name === "SyntaxError") {
        customError = new CustomError("Syntax Error", 400) //uygulama tarafından bazen syntax error atılırsa bu custom errora yönlendirme yapmak gerekir yoksa status undefined kalır
    }

    if (err.code === 11000) {
        //Duplicate key
        customError = new CustomError("Duplicate entry", 400)
    }

    if (err.name === "CastError") {
        customError = new CustomError("Please provide a valid id")
    }


    res.status(customError.status || 500).json({
        success: false,
        message: customError.message || "Internal Server Error"//errorun messageı yoksa bu gececek yerine 
    })


}

module.exports = customErrorHandler

//senkron islemleri bu sekilde yakalayabiliriz 
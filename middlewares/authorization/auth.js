const CustomError = require("../../helpers/errors/CustomError")
const jwt = require("jsonwebtoken")

const getAccessToRoute = (req, res, next) => {
    const { JWT_SECRET_KEY } = process.env
    if (!(req.headers.authorization && req.headers.authorization.startsWith("Bearer:"))) {
        return next(new CustomError("You are not authorized to access this route ", 401))
    }

    const accessToken = req.headers.authorization.split(" ")[1];

    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return next(new CustomError("Session expired. Please login again.", 401))
        }
        req.user = {
            id: decoded.id,
            name :decoded.name
        }
        next()
    })
}


module.exports = { getAccessToRoute }
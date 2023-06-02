const bcrypt = require("bcryptjs")

const validateUser = (email, password) => {
    return email && password
}

const comparePassword = (password,hashedPassword)=>{
 return bcrypt.compareSync(password,hashedPassword)
}
module.exports = { validateUser ,comparePassword}
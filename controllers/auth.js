const CustomError = require("../helpers/errors/CustomError")
const User = require("../models/User")
const asyncErrorWrapper = require('express-async-handler')
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers")
const { validateUser, comparePassword } = require("../helpers/input/inputHelpers")
const sendEmail = require("../helpers/libraries/sendEmail")

// // async islemlerdeki express ile yakalamk icin try catch kullanman gerek next ile error u yollamalısın
// const register = async (req, res, next) => {
//   try {
//     const name = "sefa"
//     const email = "merve2 fan@gmail.com"
//     const password = "1234567"
//     const user = await User.create({ name, email, password });
//     res.json({ success: true, data: user });
//   } catch (err) {
//     return next(new CustomError(err,400 ))
//   }
// }

//veya asyncerrorhandler ile wrapper icine alirsak o zaten erroru yolluyor

const register = asyncErrorWrapper(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    sendJwtToClient(user, res)
    // const token = user.generateJWTFromUser();
    // console.log(token)
    // res.json({ success: true, data: user });
})



const login = asyncErrorWrapper(async (req, res, next) => {
    const { email, password } = req.body
    if (!validateUser(email, password)) {
        return next(new CustomError("Please check your input", 400))
    }

    const user = await User.findOne({ email }).select("+password")

    if (!comparePassword(password, user.password)) {
        return next(new CustomError("Please check your credentials", 400))
    }

    sendJwtToClient(user, res)

}
)

const logout = asyncErrorWrapper(async (req, res, next) => {
    const { NODE_ENV } = process.env

    res.status(200)
        .cookie({
            httpOnly: true,
            expires: new Date(Date.now()),
            secure: NODE_ENV === "development " ? false : true
        })
        .json({
            success: true,
            message: "Logout is Successfull"
        })
})



const authError = (req, res, next) => {
    return next(new CustomError("Auth Error", 400)) //customerrorhandlera gecer
}


//TODO req.body de ne sorulursa sorulsun login yapılan hesabın name ve id si veriliyor
const getUser = (req, res, next) => {
    res.json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name
        }
    })
}

const uploadImage = asyncErrorWrapper(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, {
        "profile_img": req.savedProfileImage
    }, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        message: "Profile Image Upload Successfull",
        data: user
    })
})

const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
    const resetEmail = req.body.email
    const user = await User.findOne({ email: resetEmail })
    if (!user) {
        return next(new CustomError("There is no user with that email", 400))
    }
    const resetPasswordToken = user.getResetPasswordTokenFromUser();
    await user.save()

    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`

    const emailTemplate = `
    <h3>Reset Your Password</h3>
    <p>This <a href = '${resetPasswordUrl}' target = '_blank'>link</a> will expire in 1 hour</p>
    `

    try {
        await sendEmail({
            from: process.env.SMTP_USER,
            to: resetEmail,
            subject: "Reset Your Password",
            html: emailTemplate
        });
        return res.status(200).json({
            success: true,
            message: "Token sent to your email"
        })
    } catch (err) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()
        return next(new CustomError("Email Could Not Be Sent", 500))
    }


})

const resetPassword = asyncErrorWrapper(async (req, res, next) => {

    const {resetPasswordToken} = req.query ;

   const {password} = req.body;
   
   if (!resetPasswordToken) {
    return next(new CustomError("Please provide a valid token",400))
   }

   let user = await User.findOne({
    resetPasswordToken : resetPasswordToken,
    resetPasswordTokenExpire : {$gt : Date.now()}
   })
   if (!user) {
    return next(new CustomError("Invalid token or session expired",400))
   }

   user.password = password;
   user.resetPasswordToken = undefined;
   user.resetPasswordTokenExpire = undefined;
   await user.save();


   return res.status(200).json({
    success:true,
    message :"Reset Password Process Successful"
   })
})



module.exports = {
    register,
    login,
    authError,
    getUser,
    logout,
    uploadImage,
    forgotPassword,
    resetPassword

}
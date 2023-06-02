const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require("crypto")


const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Zorunlu alan"],
    },
    email: {
        type: String,
        required: [true, , "Zorunlu alan"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Geçerli bir mail adresi giriniz"]
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    password: {
        type: String,
        minlength: [6, "En az 6 karakterden olusmali"],
        required: [true, "Zorunlu alan"],
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String
    },
    about: {
        type: String
    },
    place: {
        type: String
    },
    website: {
        type: String
    },
    profile_img: {
        type: String,
        default: "default.jpg"
    },
    blocked: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordTokenExpire: {
        type: Date
    }
})
//USerSchema Methods
UserSchema.methods.generateJWTFromUser = function () {
    const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env
    const payload = {
        id: this._id,
        name: this.name
    }
    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRE
    })
    return token;
}

UserSchema.methods.getResetPasswordTokenFromUser = function () {
    const { RESET_PASSWORD_EXPIRE } = process.env
    const randomHexString = crypto.randomBytes(10).toString("hex");
    const resetPasswordToken = crypto.createHash("SHA256").update(randomHexString).digest("hex")

    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordTokenExpire = new Date(Date.now() + parseInt(RESET_PASSWORD_EXPIRE));

    return resetPasswordToken;

}


UserSchema.pre("save", function (next) {
    //Parola değişmemişsse
    if (!this.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) next(err)
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) next(err)
            this.password = hash;
            next();
        });
    });
})


const User = mongoose.model('User', UserSchema);

module.exports = User; 
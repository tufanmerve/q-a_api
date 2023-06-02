const sendJwtToClient = (user, res) => {
    const token = user.generateJWTFromUser();
    const { COOKIE_EXPIRE, NODE_ENV } = process.env
    return res
        .status(200)
        .cookie("access_token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + parseInt(COOKIE_EXPIRE) * 1000 * 60 ),
            secure: NODE_ENV === "development" ? false : true
        })
        .json({
            success: true,
            access_token: token,
            data: {
                name: user.name,
                email: user.email
            }
        })
}

module.exports = { sendJwtToClient }
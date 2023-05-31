const createError = require('http-errors')
const User = require(`../Models/Usermodel`)
const { authSchema } = require('../Helpers/validationSchema')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../Helpers/jwtHelper')
const { sign } = require('jsonwebtoken')



module.exports = {
    register: async (req, res, next) => {
        try {
            // const { email, password } = req.body
            // if (!email || !password) throw createError.BadRequest()
            const result = await authSchema.validateAsync(req.body)
            // console.log(result)

            const doesExist = await User.findOne({ email: result.email })
            if (doesExist) throw createError.Conflict(`${result.email} is already been registered`)

            const user = new User(result)
            const saveUser = await user.save()
            const accessToken = await signAccessToken(saveUser.id)
            const refreshToken = await signRefreshToken(saveUser.id)

            res.send({ accessToken, refreshToken })

        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },


    login: async (req, res, next) => {
        try {
            const result = await authSchema.validateAsync(req.body)
            const user = await User.findOne({ email: result.email })

            if (!user) throw createError.NotFound("User not registered")

            const isMatch = await user.isValidPassword(result.password)
            if (!isMatch) throw createError.Unauthorized('Username/Password not valid')

            const accessToken = await signAccessToken(user.id)
            const refreshToken = await signRefreshToken(user.id)

            res.send({ accessToken, refreshToken })
        } catch (error) {
            if (error.isJoi === true) return next(createError.BadRequest("Invalid Username/Password"))
            next(error)

        }
    },
    refreshToken: async (req, res, next) => {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) throw createError.BadRequest()
            const userId = await verifyRefreshToken(refreshToken)

            const accessToken = await signAccessToken(userId)
            const refToken = await signRefreshToken(userId)
            res.send({ accessToken: accessToken, refreshToken: refToken })

        } catch (error) {
            next(error)

        }
    }

}
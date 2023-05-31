const JWT = require('jsonwebtoken')
const createError = require('http-errors')




module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const paylod = { userId }
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: "5h",
                issuer: "pickurpage.com",
                audience: userId
            }
            JWT.sign(paylod, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    // reject(err)
                    reject(createError.InternalServerError())

                }
                resolve(token)
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        console.log(req.get('authorization'));
        if (!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, paylod) => {
            if (err) {
                //     if (err.name === 'JsonWebTokenError') {
                //         return next(createError.Unauthorized())
                //     } else {
                //         return next(createError.Unauthorized(err.message))
                //     }
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createError.Unauthorized(message))
            }
            req.paylod = paylod
            next()
        })

    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const paylod = {}
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options = {
                expiresIn: "1y",
                issuer: "pickurpage.com",
                audience: userId
            }
            JWT.sign(paylod, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    // reject(err)
                    reject(createError.InternalServerError())

                }
                resolve(token)
            })
        })
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, paylod) => {
                if (err) return reject(createError.Unauthorized())
                const userId = paylod.aud

                resolve(userId)
            })
        })
    }
}
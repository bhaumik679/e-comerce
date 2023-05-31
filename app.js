const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
require('dotenv').config()
require('./Helpers/initMongodb')
const { verifyAccessToken } = require('./Helpers/jwtHelper')

const authRoutes = require(`./Routes/authRoutes`)
const productRouters = require('./Routes/productRoutes')
const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', verifyAccessToken, async (req, res, next) => {
    // console.log(req.headers['authorization'])
    res.send("hello from express.")
})
app.use('/auth', authRoutes)
app.use('/', productRouters)
app.use(async (req, res, next) => {
    // const error = new Error('not found')
    // error.status = 404
    // next(error)
    next(createError.NotFound('This route does not exist'))
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})




const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})



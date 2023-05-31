const express = require('express')
const router = express.Router()
const AuthController = require('../Controllers/AuthControllers')

router.post('/register', AuthController.register)


router.post('/login', AuthController.login)

router.post('/refresh-token', AuthController.refreshToken)

router.delete('/logout', async (req, res, next) => {
    res.send("logout router")
})


module.exports = router














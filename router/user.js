const express = require('express')
const boom = require('boom')
const Result = require('../models/Result')
const { login, findUser } = require('../services/user')
const { md5, decoded } = require('../utils')
const { PWD_SALT, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/login',
    [
        body('username').isString().withMessage('用戶名稱必須為字串'),
        body('password').isString().withMessage('密碼必須為字串')
    ],
    function (req, res, next) {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            const [{ msg }] = err.errors
            next(boom.badRequest(msg))
        } else {
            let { username, password } = req.body
            password = md5(`${password}${PWD_SALT}`)
            login(username, password).then((user) => {
                if (!user || user.length === 0) {
                    new Result('登錄失敗').fail(res)
                } else {
                    const token = jwt.sign(
                        { username },
                        PRIVATE_KEY,
                        { expiresIn: JWT_EXPIRED }
                    )
                    new Result({ token }, '登錄成功').success(res)
                }
            })
        }
    })

router.get('/info', function (req, res) {
    const decode = decoded(req)
    console.log(decode)
    if (decode && decode.username) {
        findUser(decode.username).then((user) => {
            user.roles = [user.role]
            if (user) {
                new Result(user, '用戶信息查詢成功').success(res)
            } else {
                new Result('用戶信息查詢失敗').fail(res)
            }
        })
    } else {
        new Result('用戶信息查詢失敗').fail(res)
    }
})


module.exports = router
const express = require('express')
const boom = require('boom')
const user = require('./user')
const jwtAuth = require('./jwt')
const Result = require('../models/Result')

const router = express.Router()

router.use(jwtAuth)

router.get('/', function (req, res) {
    res.send('歡迎學習小慕讀書管理後台')
})

router.use('/user', user)

/**
 * 集中處理404請求的中間件
 * 注意：該中間件必須放在正常處理流程之後
 * 否则，會攔截正常請求
 */
router.use((req, res, next) => {
    next(boom.notFound('接口不存在'))
})

/**
 * 自定義路由異常處理中間件
 * 注意兩點：
 * 第一，方法的參數不能减少
 * 第二，方法的必須放在路由最後
 */
router.use((err, req, res, next) => {
    console.log(err)
    if (err.name && err.name === 'UnauthorizedError') {
        const { status = 401, message } = err
        new Result(null, 'Token驗證失敗', {
            error: status,
            errorMsg: message
        }).jwtError(res.status(status))
    } else {
        const msg = (err && err.message) || '系统錯誤'
        const statusCode = (err.output && err.output.statusCode) || 500;
        const errorMsg = (err.output && err.output.payload && err.output.payload.error) || err.message
        new Result(null, msg, {
            error: statusCode,
            errorMsg
        }).fail(res.status(statusCode))
    }
})




module.exports = router
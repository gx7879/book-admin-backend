const express = require('express')
const app = express()
const router = require('./router')
const boom = require('boom')
const fs = require('fs')
const https = require('https')
const cors = require('cors')
// const bodyParser = require('body-parser')

const privateKey = fs.readFileSync('./https/book_youbaobao_xyz.key')
const cert = fs.readFileSync('./https/book_youbaobao_xyz.crt')
const cerdentals = { key: privateKey, cert }
const httpServer = https.createServer(cerdentals, app)

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/', router)

const PORT = 5000
// const server = app.listen(PORT, function(){
//     const { address, port } = server.address()
//     console.log('HTTP 服務啟動成功: http://%s:%s ', address, port)
// })
httpServer.listen(18082, function () {
    console.log('HTTPS Server is running on: https://localhost:%s', 18082)
})
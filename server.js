// const https = require('https')
const fs = require('fs')
const cheerio = require('cheerio')
const querystring = require('querystring')
const request = require('request')
// const express = require('express')

// const app = express()
// app.listen(3333, () => {
//     console.log('listening at port 3333')
// })

let URL = 'https://ultimateframedata.com/'

request({
    url: URL,
    method: 'GET',
    headers: {
        'content-type': 'text/html'
    }
}, function (error, response, body) {
       console.log(body)
})
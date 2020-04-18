const https = require('https')
const cheerio = require('cheerio')
const request = require('request')

request('https://baidu.com/', function(error, response, body) {
    console.log(body)
})
const http = require('http')
const fs = require('fs')
const cheerio = require('cheerio')
const request = require('request')

let URL = 'https://ultimateframedata.com/'
let reqOptions = {
    url: URL,
    method: 'GET',
    headers: {
        'content-type': 'text/html'
    }
}

function getNodeList (selector) {
    return new Promise ((resolve, reject) => {

        request(reqOptions, function(error, response, body) {
            if (error != null) {
                reject(error)
            } else {
                let $ = cheerio.load(body)
                let nodeList = Object.values($(selector))
                resolve(nodeList)
            }
        })

    })
}

// 返回角色列表
async function getCharList() {
    try {
        console.log('waiting response')
        let nodeList = await getNodeList('#charList .charactericon a')
        console.log('get response data')
        let charList = nodeList.slice(1)
        
        let charData = {}
        for (let i = 0; i < charList.length - 4; i++) {
            charData[charList[i]['attribs']['title']] = {
                name: charList[i]['attribs']['title'],
                href: charList[i]['attribs']['href']
            }
        }
        return charData
    } catch(err) {
        console.log(err)
    }
}

getCharList().then(data => {console.log(data, '123')})

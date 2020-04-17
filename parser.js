const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')

let HOSTNAME = 'https://ultimateframedata.com'
let path = ''
let reqOptions = {
    url: HOSTNAME,
    method: 'GET',
    headers: {
        'content-type': 'text/html'
    }
}

function getNodeList (selector) {
    return new Promise ((resolve, reject) => {
        console.log('requesting')
        request(HOSTNAME, function(error, response, body) {
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
function getCharList () {
    return new Promise ((resolve, reject) => {
        let charList = {}
        fs.open(__dirname + '/json/charList.json', (err, fd) => {
            if (err) {
                // 请求数据并写入charList.json
                console.log('write charList.json')

                getNodeList('#charList .charactericon a')
                    .then(nodeList => {
                        nodeList = nodeList.slice(1)
                        console.log('receive data')
                        
                        for (let i = 0; i < nodeList.length - 4; i++) {
                            charList[nodeList[i]['attribs']['title']] = {
                                name: nodeList[i]['attribs']['title'],
                                href: nodeList[i]['attribs']['href']
                            }
                        }

                        let dataStr = JSON.stringify(charList)
                        writeFile('charList.json', dataStr)
                        resolve(charList)
                    })
            } else {
                // 从本地读取charList.json
                console.log('read charList.json')
                fs.readFile(__dirname + '/json/charList.json', 'utf-8', function(err, data) {
                    if (err) {
                        console.log(err)
                    }
                    charList = JSON.parse(data)
                    console.log(charList)
                    resolve(charList)
                })
            }
        })
    })
}

function writeFile (fileName, data) {
    if (data == undefined || fileName == undefined) {
        return
    }
    fs.writeFile(__dirname + `/json/${fileName}`, data, err => {
        if (err) {
            console.log(err)
        } else {
            console.log(`${fileName} created`)
        }
    })
}

async function getMoveFrameData (characterName, moveType, moveName) {
    let charList = await getCharList() 
    const URL = HOSTNAME + charList[characterName]['href']
    console.log(URL)
    // request(URL, function(error, response, body) {
    //     let $ = cheerio.load(body)
    // })
}

getMoveFrameData('Mario')
const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')
const http = require('http')

let HOSTNAME = 'https://ultimateframedata.com'
let path = ''
let reqOptions = {
    url: HOSTNAME,
    method: 'GET',
    headers: {
        'content-type': 'text/html'
    }
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

function getHTML (path = '') {
    return new Promise ((resolve, reject) => {
        console.log('requesting')
        request(HOSTNAME + path, function(error, response, body) {
            if (error != null) {
                reject(error)
            } else {
                resolve(body)
            }
        })

    })
}

// 返回角色列表
function getCharList () {
    return new Promise ((resolve, reject) => {
        let charList = {}
        fs.open(__dirname + '/json/CharList.json', (err, fd) => {
            if (err) {
                // 请求数据并写入CharList.json
                console.log('write CharList.json')

                getHTML()
                    .then(html => {
                        let $ = cheerio.load(html)
                        let nodeList = $('#charList .charactericon a')
                        nodeList.each((index, item) => {
                            charList[item.attribs.title] = {
                                name: item.attribs.title,
                                href: item.attribs.href,
                                imgSrc: '/characterart/dark' + item.attribs.href.substr(0, item.attribs.href.length - 4) + '.jpg'
                            }
                        })

                        let dataStr = JSON.stringify(charList, null, 4)
                        writeFile('CharList.json', dataStr)
                        resolve(charList)
                    }).catch(err => {console.log(err, err.message)})
            } else {
                // 从本地读取CharList.json
                console.log('read CharList.json')
                fs.readFile(__dirname + '/json/CharList.json', 'utf-8', function(err, data) {
                    if (err) {
                        console.log(err)
                    }
                    charList = JSON.parse(data)
                    resolve(charList)
                })
            }
        })
    })
}

function getMoveFrameData (characterName) {
    return new Promise (async function(resolve, reject) {
        let charList = await getCharList()

        let html = await getHTML(charList[characterName]['href'])   
        let $ = cheerio.load(html)
        let nodeList = $('#contentcontainer .moves')

        nodeList.each((index, item) => {
            let moveClass = $(item).prev().text().replace(/[\s]/g,"")
            charList[characterName][moveClass] = {}

            $(item).find('.movecontainer').each((key, el) => {
                let moveName = $(el).find('.movename').text().replace(/[\s]/g,"")
                charList[characterName][moveClass][moveName] = {}
                let startUp = $(el).find('.startup').text().replace(/[\s]/g,"")
                let advantage = $(el).find('.advantage').text().replace(/[\s]/g,"")
                let activeframes = $(el).find('.activeframes').text().replace(/[\s]/g,"")
                charList[characterName][moveClass][moveName]['starUp'] = startUp
                charList[characterName][moveClass][moveName]['advantage'] = advantage
                charList[characterName][moveClass][moveName]['activeframes'] = activeframes
            })
        })
        resolve(charList[characterName])
    })
}

    getMoveFrameData('Mario')
  
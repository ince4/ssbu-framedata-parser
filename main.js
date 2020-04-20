const parser = require('./parser')

parser.getCharFrameData('Wolf')
    .then(data => {console.log(data)})
'use strict'

const fs = require('fs');
const {Transform} = require('stream');


const dataObject = {};

const textToWordsTransform = (textString) => {
    const trimmedTextString = textString.replace(/[^\w ]/gm, '');
    return trimmedTextString.split(' ')
}

const updateDataObject = (words) => {
    words.forEach((word) => {
        if (dataObject[word]) {
            const wordCount = dataObject[word];
            dataObject[word] = wordCount + 1;
        } else {
            dataObject[word] = 1;
        }
    })
    return dataObject;
}

const parseDataObject = (data) => {
    const words = Object.keys(data).sort();
    const textIndexes = words.map((word) => data[word]);

    return `[${textIndexes.join(',')}]`;
}

const transformData = (textChunk) => {
    const words = textToWordsTransform(textChunk);
    const newDataObject = updateDataObject(words);
    return parseDataObject(newDataObject);
}

const transformCallback = new Transform ({
    transform(chunk, encoding, callback) {
        callback(null, transformData(chunk.toString()))
    }
})

module.exports = {
    async run(filePath) {
        const readStream = await fs.createReadStream(filePath, {encoding: 'UTF8', objectMode: true});
        const writeStream = await fs.createWriteStream('src/homework_2/output', {encoding: 'UTF8'});

        readStream.pipe(transformCallback).pipe(writeStream);

        readStream.on('error', (err) => {
            console.error('Cannot read the file', err)
        })
    }
}

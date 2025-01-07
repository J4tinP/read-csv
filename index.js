const fs = require('fs');
const csv = require('csv-parser');

const readCSV = (filePath, index = 0, linesToRead = Infinity, onData = () => {}, onEnd = () => {}) => {
    if (!filePath.endsWith('.csv')) {
        throw new Error('Invalid file type. Only .csv files are supported.');
    }
    if (typeof index !== 'number' || typeof linesToRead !== 'number') {
        throw new Error('Both index and linesToRead must be numbers.');
    }

    const results = [];
    let currentLine = 0; 
    let linesRead = 0;  

    const stream = fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            if (currentLine >= index && linesRead < linesToRead) {
                results.push(data); 
                onData(data); 
                linesRead++;
            }
            currentLine++;

            if (linesRead >= linesToRead) {
                stream.destroy(); 
            }
        })
        .on('end', () => {
            onEnd(results); 
        })
        .on('error', (err) => {
            throw err; 
        });
};

module.exports = readCSV;

'use strict'

const fs = require('fs');
const nodePath = require('path');

const SYMBOLS_ANSI = {
    BRANCH: '├── ',
    INDENT: '   ',
    EMPTY: '',
    VERTICAL: '│ ',
    LAST_BRANCH: '└── '
};

const print = ({fileName, path, currentDepth, maxDepth, precedingSymbols, isLast}) => {
    const lines = [];
    const isDir = fs.lstatSync(path).isDirectory();

    if (currentDepth > maxDepth) {
        return lines;
    }

    const line = [precedingSymbols];
    if (currentDepth >= 1) {
        line.push(isLast ? SYMBOLS_ANSI.LAST_BRANCH : SYMBOLS_ANSI.BRANCH)
    }
    line.push(fileName)
    lines.push(line.join(''));

    if (!isDir) {
        return lines;
    }

    let contents = fs.readdirSync(path);
    contents.sort();

    contents.forEach((content, index) => {
        const isCurrentLast = index === contents.length - 1;
        const linesForFiles = print({
            fileName: content,
            path: nodePath.join(path, content),
            currentDepth: currentDepth +1,
            maxDepth,
            precedingSymbols: precedingSymbols +(currentDepth >= 1 ? isLast ? SYMBOLS_ANSI.INDENT : SYMBOLS_ANSI.VERTICAL : SYMBOLS_ANSI.EMPTY),
            isLast: isCurrentLast
        })
        lines.push.apply(lines, linesForFiles);
    })
    return lines;
}

const tree = (path, maxDepth) => {
    console.log(print ({
        fileName: nodePath.basename(nodePath.join(process.cwd(), path)),
        path,
        currentDepth: 0,
        maxDepth,
        precedingSymbols: '',
    }).join('\n'));
}

module.exports = tree;

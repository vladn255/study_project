'use strict';
const tree = require('./tree-util');

const path = process.argv[2];
const maxDepth = process.argv[3];

tree(path, maxDepth);

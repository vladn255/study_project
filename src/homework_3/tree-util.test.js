'use strict'

require('jest');
const fsMock = require('mock-fs');
const tree = require('../homework_1/tree-util.js');

const DEFAULT_MAX_DEPTH = '4';

fsMock({
    'path/to/empty-dir': {},
    'path/to/file': 'single file content',
    'path/to/dir-with-file': {
        'singleDirFile': 'dir file content',
    },
    'path/to/nested-dirs': {
        'nestedDirFile': 'nested dir content',
        'nestedDir': {
            'secondLevelNestedDirFile': 'second nested dir content',
        }
    },
    'path/to/more/nested-dirs': {
        'nestedDirFile': 'nested dir content',
        'nestedDir': {
            'secondLevelNestedDirFile': 'second nested dir content',
            'nextLevelNestedDir': {
                'thirdLevelNestedDirFile': 'third nested dir content',
                'lastEmptyDir': {}
            }
        }
    }
})

describe('Tree-util script', () => {
    const logSpy = jest.spyOn(console, 'log');

    afterEach(() => {
        logSpy.mockClear();
    })

    afterAll(() => {
        fsMock.restore();
    })

    it('should print empty dir line', () => {
        tree('path/to/empty-dir', DEFAULT_MAX_DEPTH);
        expect(logSpy).toHaveBeenNthCalledWith(1, 'empty-dir');
    })

    it('should print single file line', () => {
        tree('path/to/file', DEFAULT_MAX_DEPTH);
        expect(logSpy).toHaveBeenNthCalledWith(1, 'file');
    })

    it('should print dir with file line', () => {
        tree('path/to/dir-with-file', DEFAULT_MAX_DEPTH);
        expect(logSpy).toHaveBeenNthCalledWith(1, 'dir-with-file\n' +
            '└── singleDirFile');
    })

    it('should print multi nested dir with files line', () => {
        tree('path/to/more/nested-dirs', DEFAULT_MAX_DEPTH);
        expect(logSpy).toHaveBeenNthCalledWith(1, 'nested-dirs\n' +
            '├── nestedDir\n' +
            '│ ├── nextLevelNestedDir\n' +
            '│ │ ├── lastEmptyDir\n' +
            '│ │ └── thirdLevelNestedDirFile\n' +
            '│ └── secondLevelNestedDirFile\n' +
            '└── nestedDirFile');
    })

    it('should not go beyond max depth', () => {
        tree('path/to/more/nested-dirs', 2);
        expect(logSpy).toHaveBeenNthCalledWith(1, 'nested-dirs\n' +
            '├── nestedDir\n' +
            '│ ├── nextLevelNestedDir\n' +
            '│ └── secondLevelNestedDirFile\n' +
            '└── nestedDirFile');
    })
})

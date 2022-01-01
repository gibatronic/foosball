const { join, normalize } = require('path')
const { coverageDirectory, rootDir } = require('../jest.json')

process.stdout.write(normalize(join(rootDir, coverageDirectory)))

const {tap} = require('lodash/fp')

const isUndefined = (value) => (
	typeof value === 'undefined' ||
	value === 'undefined' ||
	value === null ||
	value === ''
)

const isFalse = (value) => (
	isUndefined(value) || value === 'false' || value === 'FALSE'
)

const check = (dependency) => tap((value) => {
	if(isUndefined(value)){
		throw new Error(`Missing required environment variable: ${dependency}.`)
	}
})

const parse = (value) => isFalse(value) ? false : value

module.exports = {check, parse}

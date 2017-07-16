const fs = require('fs-extra')
const spawn = require('@expo/spawn-async')
const deepmerge = require('deepmerge')
const expand = require('./expand')

const readAppJSON = async () => {
	const file = await fs.readFile('./app.json')
	return (JSON.parse(file) || {})
}

/* eslint-disable no-console */
const log = (...args) => console.log('[appr]', ...args)
log.error = (...args) => console.error('[appr]', ...args)
/* eslint-enable no-console */

const TERM = {stdio: 'inherit', env: process.env}

module.exports = {
	log,
	expand,
	escapeAppName: (publishName) => (
		publishName
			.toLowerCase()
			.replace(/[^a-z0-9]/gi, '-') // sanitize
			.replace(/-+/g, '-') // deduplicate dashes
			.replace(/^-*/g, '') // remove leading dashes
			.replace(/-*$/g, '') // remove trailing dashes
	),
	patchExpoAppJSON: async (patcher) => {
		const before = await readAppJSON()
		let expo = patcher

		if(typeof patcher === 'function'){
			expo = await patcher(before.expo || {})
		}

		const after = deepmerge(before, {expo})
		await fs.writeFile('./app.json', JSON.stringify(after))
	},
	spawn: (task, args) => spawn(task, args, TERM),
}

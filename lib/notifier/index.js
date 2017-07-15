/* eslint-disable global-require */
const {log} = require('../utils')

const notifiers = {
	github: require('./github'),
	noop: require('./noop'),
}

const skippingWarning = (message) => {
	log.error(`Warning: ${message}`)
	log('skipping...')
}

class Notifier {
	constructor(provider = 'noop', options = {}){
		this.provider = provider
		this.options = options
		return this
	}
	setOptions(options = {}){
		this.options = Object.assign({}, this.options, options)
		return this
	}
	async send(...args){
		this.setOptions(...args)
		const {options, provider} = this
		const fn = (notifiers[provider] || notifiers.noop).send

		if(notifiers[provider]){
			log(`trying to send message to ${provider}.`)
		}else{
			skippingWarning(`notifier "${provider}" not found.`)
		}

		const result = await fn(options)

		if(fn !== notifiers.noop){
			log(`successfully posted message to ${provider}`)
			log(`see: ${result.link}`)
		}

		return result
	}
}

module.exports = Notifier
module.exports.noop = new Notifier()

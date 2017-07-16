/* eslint-disable global-require */
const {log} = require('../utils')

const notifiers = {
	github: require('./github'),
	noop: {name: 'None'},
}

const skip = (message) => {
	log.error(`Warning: ${message}`)
	log('skipping...')
	return {}
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
	getProviderName(){
		const {provider} = this
		const instance = (notifiers[provider] || notifiers.noop)
		return instance.name || 'Unknown'
	}
	async send(...args){
		const {options, provider} = this.setOptions(...args)
		const instance = (notifiers[provider] || notifiers.noop)

		if(!notifiers[provider]){
			return skip(`Invalid notification provider: "${provider}".`)
		}

		if(instance === notifiers.noop){
			return skip(`No notification action defined.`)
		}

		log(`Notifying ${provider}...`)
		instance.validateOptions(options) // @throws if invalid
		const result = await instance.send(options)

		if(!result || !result.success){
			return skip(`Could not submit message to ${provider}.`)
		}

		log(`Successfully posted message to ${provider}.`)
		result.link && log(`See: ${result.link}`) // eslint-disable-line

		return result
	}
}

module.exports = Notifier
module.exports.noop = new Notifier()

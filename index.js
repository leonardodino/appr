const parse = require('./lib/config')
const {log, spawn} = require('./lib/utils')
const preDeploy = require('./lib/pre-deploy')
const postDeploy = require('./lib/post-deploy')

const EXP = './node_modules/exp/bin/exp.js'
const NI = '--non-interactive'

const exp = {
	login: (u, p) => spawn(EXP, ['login', NI, '-u', u, '-p', p]),
	publish: () => spawn(EXP, ['publish', NI]),
}

module.exports = async (env) => {
	log('Parsing configuration...')
	const config = parse(env)
	const {expUsername, expPassword} = config

	log('Logging into Expo...')
	await exp.login(expUsername, expPassword)

	log('Preparing project for publish...')
	await preDeploy(config)

	log('Publishing project into Expo...')
	await exp.publish()

	log('Running PostDeploy...')
	await postDeploy(config)
}

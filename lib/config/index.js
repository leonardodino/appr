const {flow, pick} = require('lodash/fp')
const crypto = require('crypto')
const Notifier = require('../notifier')
const {expand} = require('../utils')
const github = require('./github')
const travis = require('./travis')
const random = () => crypto.randomBytes(16).toString('hex')

const globals = {
	env: 'APPR_ENV',
	notifyService: 'APPR_NOTIFY_SERVICE',
	appSlug: 'APPR_APP_SLUG',
	eventType: 'APPR_EVENT',
	expUsername: 'EXP_USERNAME',
	expPassword: 'EXP_PASSWORD',
	notify: () => Notifier.noop,
	expPublishName: ['APPR_APP_SLUG', (slug) => `${slug}-r-${random()}`],
}

const derived = {
	qrUrl: (_, {expUsername, expPublishName}) => (
		`@${expUsername}/${expPublishName}`
	),
}

const config = [
	globals,
	[['notifyService'], {github}],
	[['env', 'eventType'], {travis}],
	derived,
]

const whitelist = [
	'notify', // ok
	'qrUrl', // [TODO]
	'expUrl', // [TODO]
	'expHostUrl', // [TODO]
	'expUsername', // ok
	'expPassword', // ok
	'expPublishName', // ok
]

module.exports = flow([
	expand(...config),
	pick(whitelist),
])

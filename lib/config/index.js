const {flow, pick, tap} = require('lodash/fp')
const crypto = require('crypto')
const Notifier = require('../notifier')
const { log } = require('../utils')
const {expand, escapeAppName} = require('../utils')
const github = require('./github')
const travis = require('./travis')

const DEFAULT_QR_API = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data='
const random = () => crypto.randomBytes(16).toString('hex')

const required = {
	env: 'APPR_ENV',
	appSlug: 'APPR_APP_SLUG',
	eventType: 'APPR_EVENT',
	expUsername: 'EXP_USERNAME',
	expPassword: 'EXP_PASSWORD',
	expPublishName: ['APPR_APP_SLUG', (slug) => `${slug}-r-${random()}`],
}

const extra = {
	notifyService: ({APPR_NOTIFY_SERVICE: provider}) => provider,
	qrApiPrefix: ({APPR_QR_API_PREFIX: api}) => (api || DEFAULT_QR_API),
}

const config = [
	required, extra,
	[['notifyService'], {github}],
	[['env', 'eventType'], {travis}],
	{expPublishName: (_, {expPublishName}) => escapeAppName(expPublishName)},
	{expSlug: (_, {expUsername, expPublishName}) => (`@${expUsername}/${expPublishName}`)},
	{expUrl: (_, {expSlug}) => (`https://expo.io/${encodeURI(expSlug)}`)},
	{expHostUrl: (_, {expSlug}) => (`exp://exp.host/${encodeURI(expSlug)}`)},
	{qrUrl: (_, {qrApiPrefix, expHostUrl}) => (`${qrApiPrefix}${encodeURIComponent(expHostUrl)}`)},
	{notify: (_, {notify}) => notify || Notifier.noop},
]

module.exports = flow([
	expand(config),
	tap(({env, eventType, expUsername, expPublishName, notify}) => {
		log(``)
		log(`---------------------------------`)
		log(`> Environment:    ${env}`)
		log(`> Event Type:     ${eventType}`)
		log(`> Expo User:      ${expUsername}`)
		log(`> Publish Name:   ${expPublishName}`)
		log(`> Notifications:  ${notify.getProviderName()}`)
		log(`---------------------------------`)
		log(``)
	}),
	pick([ // export whitelist
		'notify', 'qrUrl', 'expUrl',
		'expUsername', 'expPassword',
		'expHostUrl', 'expPublishName',
	]),
])

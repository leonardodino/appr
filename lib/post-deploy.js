const {log} = require('./utils')
const {get} = require('lodash')

const errorMsg = 'An error occured while trying to post your message'
const apprLink = '[APPR](https://github.com/leonardodino/appr)'
const expoLink = '[Expo](https://expo.io)'

const tag = (t) => (s) => `<${t}>${s}</${t}>`
const sup = tag('sup')
const subsup = (s) => tag('sub')(tag('sup')(s))
const code = '```'

const template = ({expUrl, expHostUrl, qrUrl}) => [
	`<a href="${expUrl}"><img align="left" width="160" src="${qrUrl}"></a>`,
	`## Scan with ${expoLink} ${subsup(`&#9474;&nbsp;${subsup(apprLink)}`)}`,
	sup(`Scanning this QR code with your Expo app loads this experience.`),
	'<br/>',
	`${code}${expHostUrl}${code}`,
].join('\n')

const getProvider = (n) => get(n, 'provider', 'noop')

module.exports = async ({expUrl, expHostUrl, qrUrl, notify}) => {
	const provider = getProvider(notify)
	const message = template({expUrl, expHostUrl, qrUrl})

	if(provider === 'noop'){
		log('no where to post, skipping...')
		return Promise.resolve({})
	}

	try{
		return await notify.send({message})
	}catch(e){
		log.error(`${errorMsg} to ${provider}.`, e)
		return Promise.resolve({})
	}
}

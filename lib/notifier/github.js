const _ = require('lodash/fp')
const request = require('got')

const url = (slug, type, id) => [
	'https://api.github.com/repos',
	slug, type, id, 'comments'
].join('/')

const parse = ({slug, type, id}) => ({
	pull_request: {
		url: url(slug, 'issues', id),
		destination: `GitHub Pull Request #${id}`,
	},
	push: {
		url: url(slug, 'commits', id),
		destination: `GitHub Commit ${id.slice(0, 7)}`,
	},
}[type])


const vError = (key) => {
	throw new Error(`GitHub: Missing required option: "${key}".`)
}
const requiredKeys = ['username', 'token', 'message', 'slug', 'type', 'id']
const getLink = _.get('body.html_url')

module.exports = {
	name: 'GitHub',
	validateOptions: _.flow([
		_.at(requiredKeys),
		_.findIndex(_.negate(_.isString)),
		(i) => requiredKeys[i],
		(missing) => (missing && vError(missing)),
	]),
	send: async (options) => {
		const {username, token, message: body} = options

		/* eslint-disable */ let url, destination
		try{({url, destination} = parse(options))}
		catch(e){return false} // eslint-enable

		const response = await request.post(url, {
			auth: `${username}:${token}`,
			body: {body}, json: true,
			headers: {
				accept: 'application/json',
				'user-agent': 'appr-ci',
				'content-type': 'application/json',
			},
		})

		const link = getLink(response)

		return {link, destination, success: !!link}
	},
}

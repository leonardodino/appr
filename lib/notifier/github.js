const _ = require('lodash/fp')
const request = require('got')

const getNotifyUrl = ({slug, type, id}) => {
	const prefix = `https://api.github.com/repos/${slug}`
	return ({
		pull_request: `${prefix}/issues/${id}/comments`,
		push: `${prefix}/commits/${id}/comments`,
	})[type]
}

const getDestination = ({type, id}) => ({
	pull_request: `GitHub Pull Request #${id}`,
	push: `GitHub Commit ${id.slice(0, 7)}`,
}[type])

const getLink = _.get('body.html_url')

module.exports = {
	send: async (options) => {
		const {username, token, message} = options
		const url = getNotifyUrl(options)
		const destination = getDestination(options)
		const response = await request.post(url, {
			auth: `${username}:${token}`,
			json: true,
			headers: {
				accept: 'application/json',
				'user-agent': 'appr-ci',
				'content-type': 'application/json',
			},
			body: {body: message},
		})

		const link = getLink(response)

		return {link, destination}
	},
}

const Notifier = require('../notifier')

module.exports = {
	notify: [
		['GITHUB_USERNAME', 'GITHUB_TOKEN'],
		([username, token]) => new Notifier('github', {username, token}),
	],
}

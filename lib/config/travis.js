const Notifier = require('../notifier')

// eslint-disable-next-line
const notify = ([slug, id], {notify, eventType: type}) => (
	notify ? notify.setOptions({type, slug, id}) : Notifier.noop
)

module.exports = {
	pull_request: {
		notify: [['TRAVIS_REPO_SLUG', 'TRAVIS_PULL_REQUEST'], notify],
		expPublishName: ['TRAVIS_PULL_REQUEST', (id, {appSlug}) => (
			`${appSlug}-pr-${id}`
		)],
	},
	push: {
		notify: [['TRAVIS_REPO_SLUG', 'TRAVIS_COMMIT'], notify],
		expPublishName: ['TRAVIS_COMMIT', (sha, {appSlug}) => (
			`${appSlug}-commit-${sha.slice(0, 7)}`
		)],
	},
	release: {
		expPublishName: ({appSlug}) => appSlug,
	},
}

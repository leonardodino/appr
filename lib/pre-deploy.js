const {patchExpoAppJSON: patch} = require('./utils')

module.exports = async ({expPublishName}) => await patch({
	slug: expPublishName,
	privacy: 'unlisted',
})

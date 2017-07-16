const _ = require('lodash/fp')
const shell = require('./shell')

const getter = (dependency) => {
	if(dependency === null) return _.identity
	if(_.isArray(dependency)) return _.at(dependency)
	return _.get(dependency)
}

const isInvalidRequiredValue = (value) => (
	_.isNull(value) || _.isUndefined(value) || _.isEmpty(value)
)

const checkReturnValue = (dependency) => _.tap((value) => {
	if(dependency && isInvalidRequiredValue(value)){
		throw new Error(`Something went wrong: ${dependency}.`)
	}
})

const expandExpression = (source, parsed = {}) => ([dependency, parser]) => (
	_.flow([
		getter(dependency),
		dependency ? shell.check(dependency) : _.identity,
		shell.parse,
		(value) => parser(value, parsed, source),
		checkReturnValue(dependency),
	])(source)
)

const validateExpression = (expression) => {
	if(!_.isArray(expression)) throw new Error('invalid expression format')

	const [dependency, parser] = expression
	const validDependency = _.any(
		_.wrap(dependency),
		[_.isNull, _.isString, _.isArray]
	)
	const validParser = _.isFunction(parser)

	if(!validDependency) throw new Error('invalid dependency type')
	if(!validParser) throw new Error('invalid parser type')

	return expression
}

const format = (value) => {
	if(_.isArray(value)) return value
	if(typeof value === 'string') return [value, _.identity]
	if(typeof value === 'function') return [null, value]
	throw new Error('invalid expression input')
}

const expandSingleEnv = (parsed) => (_env) => {
	if(_.isPlainObject(_env)) return _env
	if(!_.isArray) throw new Error('invalid env type')
	const [keys, env] = _env
	const envPath = _.at(keys, parsed)
	const matchingEnv = _.get(envPath, env)
	return matchingEnv || {}
}

module.exports = (envs) => (source) => _.reduce((result, env) => (_.flow([
	expandSingleEnv(result),
	_.mapValues(_.flow([
		format,
		validateExpression,
		expandExpression(source, result),
	])),
	_.assign(result),
])(env)), {}, envs)

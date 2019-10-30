let env
switch (process.env.NODE_ENV) {
  case 'production':
    env = 'production'
    break
  case 'test':
    env = 'test'
    break
  case 'development':
  default:
    env = 'development'
}

exports.getCurrentEnvironment = function () {
  return env
}

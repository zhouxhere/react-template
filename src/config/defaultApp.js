const { RouteCode } = require('./routeConstants')

module.exports = {
  name: 'app',
  urls: {
    loginUrl: '/passport/login',
    defaultUrl: '/home/index',
  },
  redirects: [
    {
      from: RouteCode.ROOT,
      to: RouteCode.PAGE_HOME,
    },
  ],
}

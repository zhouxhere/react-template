const { RouteCode } = require('./routeConstants')

module.exports = {
  name: 'app',
  urls: {
    loginUrl: '/passport/login',
    defaultUrl: '/map',
  },
  redirects: [
    {
      from: RouteCode.ROOT,
      to: RouteCode.PAGE_MAP,
    },
  ],
}

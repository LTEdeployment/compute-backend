module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/user/profile')
  })
  app.use('/user', require('./user'))
  app.use('/api', require('./api'))

  // 404 page
  app.use(function (req, res) {
    if (res.headersSent) {
      return
    }
    let path = req.path
    if (path.indexOf('api') !== -1) {
      return res.json({
        code: 404,
        message: `${path} not found`,
        data: null
      })
    }
    return res.render('404')
  })

  // error page
  app.use(function (err, req, res, next) {
    if (res.headersSent) {
      return
    }
    if (req.path.indexOf('api') === -1) {
      return res.render('error', {
        error: err
      })
    }

    let message = typeof err === 'string' ? err : err.message
    if (!message) {
      message = 'unknown error'
    }
    let code = err.code ? err.code : -1
    return res.json({
      code,
      message,
      data: null
    })
  })
}

const router = require('express').Router()
const multer = require('multer')
const uuidV4 = require('uuid/v4')
const DirectionModel = require('../../models/directions')
const check = require('../../middlewares/apicheck')
const cache = require('../../lib/cache')
const config = require('xconfigjs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, uuidV4() + '.mat')
  }
})

const upload = multer({
  storage
})

router.get('/id/:id', check.checkLogin, function (req, res, next) {
  let id = req.params.id

  DirectionModel
    .getDirectionById(id)
    .then(function (result) {
      res.send(JSON.stringify(result))
    })
    .catch(function (e) {
      next(e)
    })
})

router.get('/name/:name', check.checkLogin, function (req, res, next) {
  let name = req.params.name

  DirectionModel
    .getDirectionByName(name)
    .then(function (result) {
      if (result.finished) {
        res.setHeader('Cache-Control', 'private, max-age=8640000')
      }
      res.renderJSON('ok', result)
    })
    .catch(function (e) {
      next(e)
    })
})

// 分页展示方向图，每页 5 个
router.get('/list/:page', check.checkLogin, function (req, res, next) {
  let author = req.session.user.email
  let page = req.params.page

  DirectionModel
    .getDirections(author, 5, page)
    .then(function (result) {
      res.send(JSON.stringify(result))
    })
    .catch(function (e) {
      return next(e)
    })
})

// 分页展示方向图的名字，每页 5 个
router.get('/listname/:page', check.checkLogin, function (req, res, next) {
  let author = req.session.user.email
  let page = req.params.page

  DirectionModel
    .getDirectionNames(author, 5, page)
    .then(function (result) {
      res.renderJSON('ok', result)
    })
    .catch(function (e) {
      return next(e)
    })
})

router.get('/all', check.checkLogin, function (req, res, next) {
  let author = req.session.user.email

  DirectionModel
    .getAllNames(author)
    .then(function (result) {
      return res.renderJSON('ok', result)
    })
    .catch(function (e) {
      return next(e)
    })
})

router.get('/amount', check.checkLogin, function (req, res, next) {
  let author = req.session.user.email

  DirectionModel
    .getAmount(author)
    .then(function (amount) {
      res.renderJSON('ok', amount)
    })
    .catch(function (e) {
      next(e)
    })
})

router.post('/test', check.checkNotLogin, function (req, res, next) {
  return res.renderJSON('ok', req.body.data)
})

router.post('/create', check.checkLogin, upload.single('direction'), function (req, res, next) {
  let author = req.session.user.email
  let file = req.file
  let name = req.body.name
  let description = req.body.description

  if (!file) {
    return next('未上传文件')
  }

  // 拼装一个 任务
  let direction = {
    author,
    file,
    name,
    description,
    finished: false
  }

  DirectionModel
    .create(direction)
    .then(function (directionSave) {
      cache.lpush(config.redis_mat_directions_queue, JSON.stringify(direction))
      return res.renderJSON('ok', directionSave)
    })
    .catch(function (e) {
      if (e.message.match('E11000 duplicate key')) {
        return next('这个名字的方向图已经存在了哈!')
      }
      return next(e)
    })
})

module.exports = router

var sha1 = require('sha1')
var express = require('express')
var router = express.Router()

var UserModel = require('../../models/users')
var checkNotLogin = require('../../middlewares/apicheck').checkNotLogin
var checkLogin = require('../../middlewares/apicheck').checkLogin

router.get('/check', checkLogin, function (req, res, next) {
  return res.renderJSON('ok', req.session.user)
})

// POST /signin 用户登录
router.post('/signin', checkNotLogin, function (req, res, next) {
  var email = req.body.email
  var password = req.body.password

  UserModel
    .getUserByEmail(email)
    .then(function (user) {
      if (!user) {
        return res.renderJSON('user not found', null, 404)
      }
      // 检查密码是否匹配
      if (sha1(password) !== user.password) {
        return res.renderJSON('user not found', null, 403)
      }
      req.flash('success', '登录成功')
      // 用户信息写入 session
      delete user.password
      req.session.user = user
      // 跳转到主页
      return res.renderJSON('ok', user)
    })
    .catch(next)
})

// GET /signout 登出
router.get('/signout', checkLogin, function (req, res, next) {
  // 清空 session 中用户信息
  req.session.user = null
  return res.renderJSON('ok')
})

// POST /signup 用户注册
router.post('/signup', checkNotLogin, function (req, res, next) {
  var email = req.body.email
  var bio = req.body.bio
  var password = req.body.password

  // 校验参数
  if (!(email.length >= 1 && email.length <= 100)) {
    return next('名字请限制在 1-10 个字符')
  }
  if (!(bio.length >= 1 && bio.length <= 30)) {
    return next('个人简介请限制在 1-30 个字符')
  }
  if (password.length < 6) {
    return next('密码至少 6 个字符')
  }

  // 明文密码加密
  password = sha1(password)

  // 待写入数据库的用户信息
  var user = {
    email: email,
    password: password,
    bio: bio
  }
  // 用户信息写入数据库
  UserModel.create(user)
    .then(function (result) {
      // 此 user 是插入 mongodb 后的值，包含 _id
      user = result.ops[0]
      // 将用户信息存入 session
      delete user.password
      req.session.user = user
      // 跳转到首页
      return res.renderJSON('ok')
    })
    .catch(function (e) {
      if (e.message.match('E11000 duplicate key')) {
        return next('这个邮箱已经注册过了哈!')
      }
      return next(e)
    })
})

module.exports = router

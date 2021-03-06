const Direction = require('../lib/mongo').Direction
let pub = {}

pub.create = function (direction) {
  return Direction
    .create(direction)
    .exec()
}

pub.getDirectionById = function (id) {
  return Direction
    .findOne({
      _id: id
    })
    .populate({
      path: 'author',
      model: 'User'
    })
    .addCreatedAt()
    .exec()
}

pub.getDirectionByName = function (name) {
  return Direction
    .findOne({
      name
    })
    .populate({
      path: 'author',
      model: 'User'
    })
    .addCreatedAt()
    .exec()
}

pub.getDirections = function (author, limit, page) {
  var query = {}
  if (author) {
    query.author = author
  }
  return Direction
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({
      path: 'author',
      model: 'User'
    })
    .sort({
      _id: -1
    })
    .addCreatedAt()
    .exec()
}

pub.getDirectionNames = function (author, limit, page) {
  var query = {}
  if (author) {
    query.author = author
  }
  return Direction
    .find(query)
    .fields({
      name: 1,
      description: 1,
      finished: 1
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({
      path: 'author',
      model: 'User'
    })
    .sort({
      _id: -1
    })
    .addCreatedAt()
    .exec()
}

pub.getAllNames = function (author) {
  var query = {
    finished: true
  }
  if (author) {
    query.author = author
  }
  return Direction
    .find(query)
    .fields({
      name: 1,
      description: 1
    })
    .populate({
      path: 'author',
      model: 'User'
    })
    .sort({
      _id: -1
    })
    .exec()
}

pub.getAmount = function (author) {
  var query = {}
  if (author) {
    query.author = author
  }
  return Direction
    .count(query)
    .exec()
}

module.exports = pub

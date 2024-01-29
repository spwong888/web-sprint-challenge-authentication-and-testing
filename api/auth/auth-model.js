const db = require("../../data/dbConfig")

const findByUserName = (username) => {
  return db('users as u').select('u.*').where('username', username).first()
}

const findById = (id) => {
  return db('users as u').select('u.*').where('id', id).first()
}

const add = async (user) => {
  let id = await db('users').insert(user)
  return findById(id)
}

module.exports = {
  add, 
  findByUserName
}
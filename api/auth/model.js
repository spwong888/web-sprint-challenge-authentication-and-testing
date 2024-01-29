const db = require("../../data/dbConfig.js");
const _ = require('lodash');

module.exports = {
    get,
    getByUsername,
    insert
};

async function get(id) {
    let query = db("users as u");
    return query.where("u.id", id).first();
}

async function getByUsername(username) {
    let query = db("users as u");
    return query.where("u.username", username).first();
}

async function insert(user) {
    const result = await db("users").insert(user);
    return !_.isEmpty(result) ? get(result[0]) : null;
}
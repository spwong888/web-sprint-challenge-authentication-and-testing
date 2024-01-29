const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const secret = process.env.SECRET || 'helloworld';

module.exports = {
    hashPassword,
    isPasswordValid,
    makeJwt,
    verifyJwt
};

async function hashPassword(password) {
    return new Promise((resolve, reject)=>{
        bcrypt.hash(password, 8, function(err, hash) {
            if (err) {
                return reject(err);
            }
            return resolve(hash);
        });
    });
}

async function isPasswordValid(plain, hash) {
    return await bcrypt.compare(plain, hash);
}

async function makeJwt(body) {
    return new Promise((resolve, reject) => {
        jsonwebtoken.sign(body, secret, function(err, token) {
            if (err) {
                return reject(err);
            }
            return resolve(token);
        });
    });
}

async function verifyJwt(token) {
    return new Promise((resolve, reject) => {
        jsonwebtoken.verify(token, secret, function(err, decoded) {
            if (err) {
                return reject(err);
            }
            return resolve(decoded);
        });
    });
}
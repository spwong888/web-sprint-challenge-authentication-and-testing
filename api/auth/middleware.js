const _ = require('lodash');

const validateBody = function (req, res, next) {

    if (_.isNil(req.body.username) || _.isNil(req.body.password)) {
        return res.status(400).send('username and password required');
    }

    next()
}

module.exports.validateBody = validateBody;
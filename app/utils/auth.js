const Users = require("../models/users.model");
const { createHash } = require('crypto');

exports.hash = (string) => {
    return createHash('sha256').update(string).digest('hex');
}

exports.execIfAuthValid = (req, res, role, callIfAuth) => {
    console.log(JSON.stringify(req.headers)); // debugging only
    if (req.headers['x-auth-username'] === undefined || req.headers['x-auth-password'] == undefined) {
        console.log("no x-auth-* headers received");
        res.status(403).send({
            message: 'Authentication required but not provided'
        });
        return;
    }
    let username = req.headers['x-auth-username'];
    let password = req.headers['x-auth-password'];
    let passwordHash = exports.hash(password);
    console.log("Username: " + username + ", password: " + password + ", passHash: " + passwordHash);    //
    Users.findByUsername(username, (err, user) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(403).send({ // (*) identical reaction wheter user was not found or password was invalid or wrong role
                    message: 'Authentication invalid'
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving user with id " + req.params.id
                });
            }
        } else {
            console.log('User found: ' + JSON.stringify(user));
            if (user.password == passwordHash) {
                delete user.password; // for an abundance of security, don't send the password back, it's not needed anyway
                if (role !== undefined && role !== null) { // check role only if one was provided
                    if (user.role == role) {
                        callIfAuth(req, res, user); // *the* call
                    } else {
                        res.status(403).send({ // (*) identical reaction wheter user was not found or password was invalid or wrong role
                            message: 'Authentication invalid'
                        });
                    }
                } else {
                    callIfAuth(req, res, user); // *the* call
                }
            } else {
                res.status(403).send({ // (*) identical reaction wheter user was not found or password was invalid or wrong role
                    message: 'Authentication invalid'
                });
            }
        }
    });

}



const Users = require("../models/users.model");
const Auth = require("../utils/auth");

//Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    isUserValid(req, res, (isValidResult) => {
        if (isValidResult) {
            // Create a User
            // TODO: encrypt the password SHA256
            const user = new Users({
                username: req.body.username,
                password: Auth.hash(req.body.password),
                email: req.body.email,
                address: req.body.address,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                phone_number: req.body.phone_number,
                // FIXME: only admin can create admins, anonymous registration only creates users
                role: req.body.role || 'User'
            });
            // Save user in the database
            Users.create(user, (err, data) => {
                if (err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the User."
                    });
                else {
                    delete data['password'];
                    res.status(201).send(data); // better to send data.id only
                }
            });
        }
    });
};

// Find currently authenticated user info (good for login testing) - minimizing code duplication
exports.findMe = (req, res) => {
    Auth.execIfAuthValid(req, res, null, (req, res, user) => {
        res.status(200).send(user);
    });
};


// find one user by username
exports.findOne = (req, res) => {
    Users.findByUsername(req.params.username, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found products with username ${req.params.username}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving products with username " + req.params.username
                });
            }
        } else res.status(200).send(data);
    });
};


/* // educational purpose only
// DO NOT USE: Find currently authenticated user info (good for login testing) - version that would result it massive code duplication
exports.findMe = (req, res) => {
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
    let passwordHash = Auth.hash(password);
    console.log("Username: " + username + ", password: " + password + ", passHash: " + passwordHash);
    //
    UserClass.findByUsername(username, (err, user) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(403).send({ // (*) identical reaction wheter record was not found or password was invalid
                    message: 'Authentication invalid'
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving ToDo with id " + req.params.id
                });
            }
        } else {
            console.log('User found: ' + JSON.stringify(user));
            if (user.password == passwordHash) {
                res.status(200).send(user);
            } else {
                res.status(403).send({ // (*) identical reaction wheter record was not found or password was invalid
                    message: 'Authentication invalid'
                });
            }
        }
    });
}; */

// used by insert and update
function isUserValid(req, res, callback) {
    //console.log("isValid: ",res);
    if (req.body.id) {
        res.status(400).send({
            message: "id is provided by the system. User not saved",
            result: false
        });
        //console.log("if cond: ",res.send.result);
        return callback(false);
    }
    // console.log(JSON.stringify(req.body));
    if (req.body.username === undefined || req.body.password === undefined) {
        res.status(400).send({ message: "username and password must be provided" });
        return callback(false);
    }
    if (req.body.first_name === undefined || req.body.last_name === undefined) {
        res.status(400).send({ message: "Name must be provided" });
        return callback(false);
    }
    if (req.body.address === undefined) {
        res.status(400).send({ message: "Address must be provided" });
        return callback(false);
    }

    if (!req.body.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
        res.status(400).send({ message: "Invalid email!" });
        return callback(false);
    }
    //var phone = "^\\+(?:[0-9] ?){6,14}[0-9]$";
    if (!req.body.phone_number.match(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/)) {
        res.status(400).send({ message: "Invalid phone number!" });
        return callback(false);
    }

    if (!req.body.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/)) {
        res.status(400).send({ message: "password must be 8+ characters long and contain at least one uppercase, lowercase, digit, and special character" });
        return callback(false);
    }
    
    let username = req.body.username;
    if (!username.match(/^[a-zA-Z0-9_]{5,45}$/)) {
        res.status(400).send({ message: "username must be 5-45 characters long made up of letters, digits and underscore" });
        return callback(false);
    }
    // use Users.findByUsername to check if username exists in the database
    Users.findByUsername(username, (err, user) => {
        if (err) {
            if (err.kind === "not_found") {
                // user not found, which means username is available
                if (req.body.role !== undefined) {
                    if (req.body.role != "User" && req.body.role !== "Admin") {
                        res.status(400).send({ message: "Role must be User or Admin" });
                        return callback(false);
                    }
                }
                // if all checks passed successfully, user is valid
                return callback(true);
            } else {
                // an error occurred
                res.status(500).send({ message: "Error checking username existence in the database" });
                return callback(false);
            }
        } else if (user) {
            // if user is found, then username is taken
            res.status(400).send({ message: "username already exists" });
            return callback(false);
        }
    });
}


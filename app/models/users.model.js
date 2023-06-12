const connection = require("./db.js");
const db = require("./db.js");

const Users = function (user) {
    this.user_id = user.user_id;
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
    this.address = user.address;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.phone_number = user.phone_number;
    this.role = user.role;
};

/* Users.findOne = (username) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM users WHERE username = ?`, [username], (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
                return;
            }

            if (res.length) {
                console.log("found user: ", res[0]);
                resolve(res[0]);
                return;
            }

            // not found user with the username
            reject({ kind: "not_found" });
        });
    });
}; */

Users.create = (newUser, result) => {
    db.query("INSERT INTO users SET ?", newUser, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created user: ", { id: res.insertId, ...newUser });
      result(null, { id: res.insertId, ...newUser });
    });
  };
  
  //return one user by username
  Users.findByUsername = (username, result) => {
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found user: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // user not found
      result({ kind: "not_found" }, null);
    });
  };
  
  
  //return one user by id
  Users.findById = (id, result) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found users: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found user with the id
      result({ kind: "not_found" }, null);
    });
  };


module.exports = Users;
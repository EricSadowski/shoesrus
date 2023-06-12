const db = require("./db.js");
const moment = require('moment');

const Orders = function(order) {
    this.order_id = order.order_id;
    this.user_id = order.user_id;
    this.date = moment().format("YYYY-MM-DD");
    this.status = order.status;
    this.pre_tax_total = order.pre_tax_total;
    this.shipping = order.shipping;
    this.taxes = order.taxes;
    this.final_total = order.final_total;
};

/* Orders.findOne = (query) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM orders WHERE user_id = ? AND status = ?', [query.user_id, query.status], (err, result) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
                return;
            }

            if (result.length) {
                console.log("found order: ", result[0]);
                resolve(result[0]);
            } else {
                // Order not found
                reject({ kind: "not_found" });
            }
        });
    });
}; */

Orders.create = (userId, result) => {
    let order = {
        user_id: userId,
        date: moment().format("YYYY-MM-DD"),
        status: 'pending',
    }

    db.query('INSERT INTO orders SET ?', order, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created order: ", {
            order_id: res.insertId,
            ...order
        });
        result(null, {
            order_id: res.insertId,
            ...order
        });
    });
};

Orders.update = (order, result) => {
    db.query(
        'UPDATE orders SET pre_tax_total = ?, shipping = ?, taxes = ?, final_total = ? WHERE order_id = ?',
        [order.pre_tax_total, order.shipping, order.taxes, order.final_total, order.order_id],
        (err, queryResult) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (queryResult.affectedRows == 0) {
                // not found order with the id
                result({
                    kind: "not_found"
                }, null);
                return;
            }

            console.log("updated order: ", {
                order_id: order.order_id,
                ...order
            });
            result(null, {
                order_id: order.order_id,
                ...order
            });
        }
    );
};


Orders.findByUser = (user_id, result) => {
    // FIXME: prevent SQL injection
    db.query(`SELECT * FROM orders WHERE user_id = ?`,[user_id], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        result(null, res);
        return;
      }
  
      // not found ToDO with the id
      result({ kind: "not_found" }, null);
    });
  };


module.exports = Orders;
const db = require("./db.js");

const OrderItems = function (orderItem) {
    this.order_id = orderItem.order_id;
    this.product_id = orderItem.product_id;
    this.quantity = orderItem.quantity;
    this.price = orderItem.price;
};

OrderItems.create = (orderItem, result) => {
    db.query('INSERT INTO order_items SET ?', orderItem, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created order item: ", {id: res.insertId, ...orderItem});
        result(null, {id: res.insertId, ...orderItem});
    });
};

/* OrderItems.findOne = (query) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM order_items WHERE order_id = ? AND product_id = ?', [query.order_id, query.product_id], (err, result) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
                return;
            }

            if (result.length) {
                console.log("found order item: ", result[0]);
                resolve(result[0]);
            } else {
                // Order item not found
                reject({ kind: "orderItem_not_found" });
            }
        });
    });
};

OrderItems.update = (orderItem) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE order_items SET quantity = ?, price = ? WHERE order_item_id = ?', [orderItem.quantity, orderItem.price, orderItem.order_item_id], (err, result) => {
                if (err) {
                    console.log("error: ", err);
                    reject(err);
                    return;
                }

                console.log("updated order item: ", orderItem);
                resolve(orderItem);
            }
        );
    });
}; */

module.exports = OrderItems;
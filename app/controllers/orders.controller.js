const Orders = require("../models/orders.model");
var moment = require('moment');


exports.findAll = (req, res) => {
    const validSortOrders = ["id", "task", "dueDate", "isDone"];
    const sortOrder = req.query.sortOrder ? req.query.sortOrder : "id";
    if (!validSortOrders.includes(sortOrder)) {
        res.status(400).send({
            message: "invalid sort order value"
        });
        return;
    }
    Orders.getAll(sortOrder, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving todos."
            });
        else{
            res.status(200).send(data);
        }

    });
};

exports.findAllByUser = (req, res) => {
    console.log("here")
    Orders.findByUser(req.params.user_id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found user with id ${req.params.user_id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving user with id " + req.params.user_id
                });
            }
        } else res.status(200).send(data);
    });
};


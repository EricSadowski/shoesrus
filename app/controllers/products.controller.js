const productsClass = require("../models/products.model");


// Retrieve all products from the database with sort condition.
exports.findAll = (req, res) => {
    const validSortOrders = ["product_id", "men", "women", "brand", "shoe_type", "price", "kids", "running", "basketball", "p_name"];
    const sortOrder = req.query.sortOrder ? req.query.sortOrder : "product_id";
    if (!validSortOrders.includes(sortOrder)) {
        res.status(400).send({
            message: "invalid sort order value"
        });
        return;
    }
    productsClass.getAll(sortOrder, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving productss."
            });
        else {
            res.status(200).send(data);
        }

    });
};

//Find a single products by the product_id
exports.findOne = (req, res) => {
    productsClass.findById(req.params.product_id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found products with product_id ${req.params.product_id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving products with product_id " + req.params.product_id
                });
            }
        } else res.status(200).send(data);
    });
};


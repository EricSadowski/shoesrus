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




// function isValproduct_id(req, res) {

//     var year = req.body.dueDate.slice(0, 4);

//     //console.log("isValproduct_id: ",res);
//     // if (req.body.product_id) {
//     //     res.status(400).send({
//     //         message: "product_id is provproduct_ided by System!!! products not saved ;)",
//     //         result: false
//     //     });
//     //     //console.log("if cond: ",res.send.result);
//     //     return false;
//     // }
//     if (req.body.task.length < 1 || req.body.task.length > 100) {
//         res.status(400).send({ message: "too big/small task! need help? task not saved!!" });
//         return false;
//     }
//     if (year < 1900 || year > 2099) {
//         res.status(400).send({ message: "Not in the correct year range!!" });
//         return false;

//     }
//     if (req.body.isDone != "Pending" && req.body.isDone !== "Done") {
//         res.status(400).send({ message: "Not supported value in Is done ;)" });
//         return false;

//     }
//     return true;

// }

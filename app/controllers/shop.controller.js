const ShopClass = require("../models/shop.model");


//Create and Save a new Todo
exports.create = (req, res) => {

    isItemValid(req, res, (isValidResult) => {
        if (isValidResult) {
    // TODO: valproduct_idate, e.g. check max size, mime-type, p_name content
    // console.log("REQ BODY: " + JSON.stringify(req.body)); // careful, you'll print out the whole uploaded file, can be hundreds of lines of text
    const item = new ShopClass({
        p_name: req.body.p_name,
        image: Buffer.from(req.body.image, 'base64'), // decode base64 to binary image for storage
        mimeType: req.body.mimeType || 'Pending',
        size: req.body.size,
        category: req.body.category,
        brand: req.body.brand,
        shoe_type: req.body.shoe_type,
        price: req.body.price,
        quantity_available: req.body.quantity_available,
        color: req.body.color

    });

    // Save product in the imagebase
    ShopClass.create(item, (err, item) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Internal error occurred while creating this document."
            });
        else res.status(201).send(item);
    });
};
    });
}

// Retrieve all products from the database (with condition).
exports.findAll = (req, res) => {
    const validSortOrders = ["product_id", "men", "women", "brand", "shoe_type", "price", "kids", "Running", "Basketball", "p_name"];
    const sortOrder = req.query.sortOrder ? req.query.sortOrder : "product_id"; // sort by product_id if no sortOrder provproduct_ided
    if (!validSortOrders.includes(sortOrder)) {
        res.status(400).send({
            message: "invalid sort order value"
        });
        return;
    }
    ShopClass.getAll(sortOrder, (err, list) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving."
            });
        else res.status(200).send(list);
    });
};

//Find a single todo by the product_id
exports.findOne = (req, res) => {
    ShopClass.findById(req.params.product_id, (err, item) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found ToDo with product_id ${req.params.product_id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving with product_id " + req.params.product_id
                });
            }
        } else {
            // Note: by sending this header you can force download instead of display. filename is optional
            // Content-Disposition: attachment; filename="filename.jpg"
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition
            res.contentType(item.mimeType).status(200).send(item.image);
        }
    });
};


function isItemValid(req, res, callback) {

    // p_name: req.body.p_name,
    // image: Buffer.from(req.body.image, 'base64'), // decode base64 to binary image for storage
    // mimeType: req.body.mimeType || 'Pending',
    // size: req.body.size,
    // category: req.body.category,
    // brand: req.body.brand,
    // shoe_type: req.body.shoe_type,
    // price: req.body.price,
    // quantity_available: req.body.quantity_available,
    // color: req.body.color

    var men = "men";
    var women = "women";
    var kids = "kids";
    // console.log(JSON.stringify(req.body));
    if (!req.body.size.match(/^\d+$/)) {
        res.status(400).send({ message: "Size must be a number" });
        return callback(false);
    }
    else if (req.body.category !== men && req.body.category !== women && req.body.category !== kids) {
        res.status(400).send({ message: "Invalid category" });
        return callback(false);
    }
    else {
        return callback(true);
    }

}
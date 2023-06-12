const db = require("./db.js");

// constructor
const ShopClass = function (products) {
  this.p_name = products.p_name;
  this.image = products.image;
  this.mimeType = products.mimeType;
  this.size = products.size;
  this.category = products.category;
  this.brand = products.brand;
  this.shoe_type = products.shoe_type;
  this.price = products.price;
  this.quantity_available = products.quantity_available;
  this.color = products.color;
};

//create
ShopClass.create = (newProduct, result) => {
  db.query("INSERT INTO products SET ?", newProduct, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created products: ", { product_id: res.insertproduct_id /*, ...newToDos */ }); // do not attempt to print a blob on the console! it's much too big.
    result(null, { product_id: res.insertproduct_id }); // Only return the product_id, sending back the entire blob is completely unnecessary and terrible for performance
  });
};

//return one by product_id
ShopClass.findById = (product_id, result) => {
  // FIXME: prevent SQL injection
  db.query('SELECT * FROM products WHERE product_id = ?', [product_id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found products: ", res[0]['product_id']); // only display the product_id, perhaps other values, but NEVER the blob
      result(null, res[0]);
      return;
    }
    // not found
    result({ kind: "not_found" }, null);
  });
};

// return all todo[serach by task and return all if any]
// WARNING: when a table has BLOBs do *NOT* fetch blobs when fetching multiple records! Only all other fields
ShopClass.getAll = (sortOrder, result) => {
   
  var query = "";
  if (sortOrder == "product_id") {
    var query = db.format("SELECT product_id, p_name, mimeType, category, brand, size, price, shoe_type, quantity_available FROM products ORDER BY product_id DESC");
  } else if (sortOrder == "men" || sortOrder == "women" || sortOrder == "kids") {
    query = db.format(`SELECT product_id, p_name, mimeType, category, brand, size, price, shoe_type, quantity_available FROM products WHERE category=? ORDER BY product_id DESC`, [sortOrder]);
  } else if(sortOrder == "price"){
    query = db.format(`SELECT product_id, p_name, mimeType, category, brand, size, price, shoe_type, quantity_available FROM products ORDER BY price ASC`, [sortOrder]);
  } else {
    query = db.format(`SELECT product_id, p_name, mimeType, category, brand, size, price, shoe_type, quantity_available FROM products WHERE shoe_type=? ORDER BY product_id DESC`, [sortOrder]);
  }


  db.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};


module.exports = ShopClass;
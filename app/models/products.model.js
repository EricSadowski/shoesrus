const db = require("./db.js");

// constructor
const productsClass = function (products) {
  this.product_id = products.product_id
  this.size = products.size;
  this.category = products.category;
  this.brand = products.brand;
  this.type = products.type;
  this.price = products.price;
  this.p_name = products.p_name;
  this.quantity_available = products.quantity_available;
  this.image = products.image;
};

//create a products
// productsClass.create = (newproductss, result) => {
//   db.query("INSERT INTO productss SET ?", newproductss, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     console.log("created productss: ", { product_id: res.insertproduct_id, ...newproductss });
//     result(null, { product_id: res.insertproduct_id, ...newproductss });
//   });
// };


//return one product by product_id
productsClass.findById = (product_id, result) => {
  // FIXME: prevent SQL injection
  db.query(`SELECT * FROM products WHERE product_id = ?`,[product_id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found products: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found products with the product_id
    result({ kind: "not_found" }, null);
  });
};

// return all products[serach by task and return all if any]
productsClass.getAll = (sortOrder, result) => {
  var query = "";
  if (sortOrder == "product_id") {
    query = db.format("SELECT * FROM products ORDER BY product_id ASC");
  } else if (sortOrder == "men" || sortOrder == "women" || sortOrder == "kids") {
    query = db.format(`SELECT * FROM products WHERE category=? ORDER BY product_id ASC`, [sortOrder]);
  } else if(sortOrder == "price"){
    query = db.format(`SELECT * FROM products ORDER BY price DESC`);
  }else{
    query = db.format(`SELECT * FROM products WHERE shoe_type=? ORDER BY product_id ASC`, [sortOrder]);
  }

 // console.log(query);
  db.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    //console.log("productss: ", res);
    result(null, res);
  });
};



productsClass.updateQuantityAvailable = (productId, product, result) => {
  db.query(
    "UPDATE products SET quantity_available = ? WHERE product_id = ?",
    [product.quantity_available, productId],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found product with the productId
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated product: ", { product_id: productId, ...product });
      result(null, { product_id: productId, ...product });
    }
  );
};


module.exports = productsClass;
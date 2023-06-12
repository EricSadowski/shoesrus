// Import the connection object from db.js file
const connection = require("./app/models/db.js");

// Define the sizes for the shoes we want to insert
const sizes = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

// Define the common attributes for the shoes
const category = "unisex";
const brand = "Nike";
const color = "White/Black/Blue";
const shoe_type = "Golf"; // Define the shoe type - this can be adjusted later if needed
const price = 170; // Define the price - this can be adjusted later if needed
const p_name = "Nike Air Max 90 G"; // Define the product name - this can be adjusted later if needed

// Iterate through each size in the sizes array
for (let i = 0; i < sizes.length; i++) {
  // Get the current size
  const size = sizes[i];

  // Generate a random quantity between 15 and 30 for this size - this can be adjusted to have more or less later
  const quantity_available = Math.floor(Math.random() * 16) + 15;

  // Create a product object with all the attributes
  const product = {
    size: size,
    category: category,
    brand: brand,
    quantity_available: quantity_available,
    color: color,
    shoe_type: shoe_type,
    price: price,
    p_name: p_name
  };

  // Insert the product into the database
  connection.query('INSERT INTO products SET ?', product, (err, result) => {
    // If there's an error, throw it
    if (err) throw err;

    // Otherwise, log the ID of the inserted product
    console.log('Last insert ID:', result.insertId);
  });
}

// Close the connection to the database
connection.end();
const productsClass = require("../models/products.model");
const Orders = require("../models/orders.model");
const OrderItems = require("../models/orderitems.model");
const Users = require("../models/users.model");
const moment = require('moment');

exports.submitOrder = (req, res) => {
    // uses username and cartItems array
    const username = req.body.username;
    const cartItems = req.body.cartItems;

    Users.findByUsername(username, (err, user) => {
        if (err) {
            res.status(500).send({
                message: "Some error occurred while finding the User."
            });
            return;
        }

        const user_id = user.user_id;

        let orderItems = [];
        let checkedItems = 0;
        let preTaxTotal = 0;
        let allItemsAvailable = true;
        let itemOutOfStock = [];

        cartItems.forEach((item, index) => {
            productsClass.findById(item.productId, (err, product) => {
                if (err || !product) {
                    console.log("Product not found.");
                    itemOutOfStock.push(`Product not found with id: ${item.productId}.`);
                    allItemsAvailable = false;
                } else if (item.quantity > product.quantity_available) { // if quantity customer wants is more than what is available
                    console.log('Not enough stock');
                    itemOutOfStock.push(`Not enough stock for product with id: ${item.productId}.`);
                    allItemsAvailable = false;
                } else {
                    orderItems.push({
                        product_id: item.productId,
                        quantity: item.quantity,
                        product: product
                    });
                }
        
                checkedItems++;
        
                if (checkedItems === cartItems.length) {
                    if (allItemsAvailable) {
                        updateQuantities(orderItems);
                    } else {
                        res.status(400).send({
                            message: itemOutOfStock.join(' ')
                        });
                    }
                }
            });
        });

        function updateQuantities(orderItems) {
            orderItems.forEach((item, index) => {
                item.product.quantity_available -= item.quantity;
                productsClass.updateQuantityAvailable(item.product_id, item.product, (err, data) => {
                    if (err) {
                        console.log("Error:", err);
                        res.status(500).send(err);
                        return;
                    }

                    if (index === orderItems.length - 1) {      // when index reaches last item
                        createOrderAndOrderItems(orderItems);
                    }
                });
            });
        }

        function calculateTaxes(preTaxTotal) {
            // sales tax: 10%
            return preTaxTotal * 0.10;
        }

        // FIXME: shipping currently calculated based on each cart item, need to remove and readjust code for flat rate shipping fee
        function calculateShipping(preTaxTotal) {
            // dummy calc
            /* return preTaxTotal * 0.05; */
            return 25; // flat rate shipping fee of $25
        }

        function createOrderAndOrderItems(orderItems) {
            Orders.create(user_id, (err, order) => {
                if (err) {
                    res.status(500).send({
                        message: "Some error occurred while creating the Order."
                    });
                    return;
                }


                orderItems.forEach((item) => {
                    const orderItem = {
                        order_id: order.order_id,
                        product_id: item.product_id,
                        quantity: item.quantity
                    };

                    OrderItems.create(orderItem, (err, data) => {
                        if (err) {
                            res.status(500).send({
                                message: "Some error occurred while creating OrderItem."
                            });
                            return;
                        }
                    });

                    const itemTotal = parseFloat(item.product.price) * item.quantity;
                    preTaxTotal += itemTotal;
                    order.pre_tax_total = preTaxTotal.toFixed(2);
                    order.taxes = calculateTaxes(parseFloat(order.pre_tax_total)).toFixed(2);
                    /* order.shipping = calculateShipping(parseFloat(order.pre_tax_total)).toFixed(2); */
                    order.shipping = calculateShipping().toFixed(2);
                    order.final_total = (parseFloat(order.pre_tax_total) + parseFloat(order.taxes) + parseFloat(order.shipping)).toFixed(2);
                });


                Orders.update(order, (err) => {
                    if (err) {
                        res.status(500).send({
                            message: "Error updating order.",
                        });
                        return;
                    }

                    res.status(200).send({
                        message: "Order updated successfully.",
                    });
                });
            });
        }
    });
};
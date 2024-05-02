const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    paymentid: {
        type: String
    },
    orderid: {
        type: String,
        required: true
    },
    status: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = mongoose.model('Order', orderSchema);

// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Order = sequelize.define('order', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     paymentid: Sequelize.STRING,
//     orderid: Sequelize.STRING,
//     status: Sequelize.STRING
// })

// module.exports = Order;
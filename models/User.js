const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    totalExpenses: {
        type: Number,
        default: 0
    },
    totalIncome: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('User', userSchema);



// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const User = sequelize.define('user', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     username: Sequelize.STRING,
//     email: {
//         type: Sequelize.STRING,
//         unique: true,
//         allowNull: false
//     },

//     password: Sequelize.STRING,
//     isPremium: Sequelize.BOOLEAN,
//     totalExpenses: Sequelize.INTEGER,
//     totalIncome: Sequelize.INTEGER


// });

// module.exports = User;
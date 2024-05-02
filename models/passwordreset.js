const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true

    },
    isactive: {
        type: Boolean,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = mongoose.model('passwordreset', passwordResetSchema)

// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const ForgotPassword = sequelize.define('ForgotPasswordRequests', {
//     id: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         primaryKey: true
//     },
//     isactive: Sequelize.BOOLEAN
// })

// module.exports = ForgotPassword;
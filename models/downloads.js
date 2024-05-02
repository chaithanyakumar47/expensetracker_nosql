const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true  
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Download = mongoose.model('Download', downloadSchema);

module.exports = Download;


// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Downloads = sequelize.define('downloads', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name: Sequelize.STRING,
//     url: Sequelize.STRING

// })

// module.exports = Downloads;
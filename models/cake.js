const mongoose = require('mongoose');


var CakeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comment: { type: String, required: true },
    imagePath: { type: String, required: true },
    yumFactor: { type: Number, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});


module.exports = mongoose.model('Cake', CakeSchema );

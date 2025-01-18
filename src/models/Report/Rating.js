const mongoose = require('mongoose');

const { Schema } = mongoose;

const ratingSchema = new Schema({
    rating_id: {
        type: Number,
        required: true,
        unique: true
    },
    amount_star: {
        type: Number,
        required: true
    },
    rating_content: {
        type: String,
        required: true
    },
    rating_editTime: {
        type: Date,
        default: Date.now
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    busCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusCompany',
        required: true
    }
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
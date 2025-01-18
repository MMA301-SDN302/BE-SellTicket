const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role_user: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
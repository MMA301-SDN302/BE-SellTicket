const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const stopMapSchema = new Schema({
    stops: [{
        stop_id: { type: Number, required: true }, 
        stop_name: { type: String, required: true }, 
        stop_time: { type: Date, default: null } 
    }]
}, {
    collection: "stopmaps",
    timestamps: true
});

const StopMap = mongoose.model('StopMap', stopMapSchema);

module.exports = StopMap;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    ticket_id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    ticket_price: {
        type: Number,
        required: true
    },
    ticket_seat: {
        type: String,
        default: null
    },
    ticket_status: {
        type: String,
        default: null
    },
    route_id: {
        type: Schema.Types.ObjectId,
        ref: 'Route',
        default: null
    }
}, {
    collection: 'ticket',
    autoIndex: false
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
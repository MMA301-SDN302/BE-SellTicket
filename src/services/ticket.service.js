const ticketRepository = require("../repository/ticket.repo.js");

const getAllTickets = async () => {
    return await ticketRepository.getAllTickets();
};

const getTicketById = async (id) => {
    return await ticketRepository.getTicketById(id);
};

const createTicket = async (data) => {
    if (!data.trip_id) {
        throw new Error("Trip ID is required");
    }
    return await ticketRepository.createTicket(data);
};

const cancelTicket = async (id) => {
    return await ticketRepository.cancelTicket(id);
};

const autoCancelUnpaidTickets = async () => {
    return await ticketRepository.autoCancelUnpaidTickets();
};

module.exports = {
    getAllTickets,
    getTicketById,
    createTicket,
    cancelTicket,
    autoCancelUnpaidTickets,
};

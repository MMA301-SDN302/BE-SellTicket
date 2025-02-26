const { createTrip, deleteTripsByRoute, getTripById } = require("../repository/trip.repo.js");
const { OK, CREATED } = require("../core/response/success.response.js");
const createTripController = async (req, res, next) => {
    try {
        const newTrip = await createTrip(req.body);
        res.status(201).json({
            message: "Trip created successfully",
            trip: newTrip
        });
    } catch (error) {
        next(error);
    }
};

const deleteTripController = async (req, res, next) => {
    try {
        console.log("req.params", req.params);
        const cancelled = await deleteTripsByRoute(req.params.id);

        res.status(200).json({
            message: "Ticket cancelled successfully",
            metadata: cancelled
        });
    } catch (error) {
        console.error("Error deleting trip:", error.message);
        res.status(500).json({ error: error.message });
    }
};
const getTripByIdController = async (req, res) => {
    const ticket = await getTripById(req.params.id);
    if (!ticket) {
        throw new NotFoundError("Ticket not found");
    }
    return new OK({
        message: "Ticket retrieved successfully",
        metadata: ticket,
    }).send(res);
};

module.exports = {
    createTripController, deleteTripController, getTripByIdController
}
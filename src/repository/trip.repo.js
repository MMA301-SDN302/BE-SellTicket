const Trip = require("../models/BusCompany/Trip");

const createTrip = async (data) => {
    return await Trip.create(data);
};

const getTripsByRoute = async (routeId) => {
    return await Trip.find({ route: routeId }).populate("car busCompany");
};

const getTripById = async (id) => {
    return await Trip.findOne({ _id: id }).populate("car busCompany");
};

const deleteTripsByRoute = async (routeId) => {
    return await Trip.deleteMany({ route: routeId });
};

module.exports = {
    createTrip,
    getTripsByRoute,
    getTripById,
    deleteTripsByRoute,
};

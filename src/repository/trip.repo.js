const Trip = require("../models/BusCompany/Trip.js");
const createTrip = async (data) => {
    try {
        return await Trip.create(data);
    } catch (error) {
        console.error("Error creating trip:", error.message);
        throw new Error("Failed to create trip. Please check input data.");
    }
};


const getTripsByRoute = async (routeId) => {
    return await Trip.find({ route: routeId }).populate("car busCompany");
};

const getTripById = async (id) => {
    console.log("check");

    return await Trip.findOne({ _id: id }).populate("car busCompany");
};

const deleteTripsByRoute = async (routeId) => {
    try {
        console.log("Received routeId:", routeId);
        const result = await Trip.findByIdAndDelete(routeId);
        console.log("Delete result:", result);
        return result;
    } catch (error) {
        console.error("Error deleting trip:", error.message);
        throw new Error("Failed to delete trip. Please check input data.");
    }
};
module.exports = {
    deleteTripsByRoute, getTripById, getTripsByRoute, createTrip
}
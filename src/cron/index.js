const cron = require("node-cron");
const tripService = require("../services/trip.service");

cron.schedule("0 6 * * *", async () => {
  try {
    console.log("Tạo chuyến đi tự động cho 30 ngày...");
    const trips = await tripService.createAutoTrip();
    console.log("Chuyến đi tự động đã được tạo:", trips.length);
  } catch (err) {
    console.error("Lỗi khi tạo chuyến đi tự động:", err.message);
  }
});

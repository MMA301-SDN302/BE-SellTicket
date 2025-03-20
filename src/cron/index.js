const cron = require("node-cron");
const tripService = require("../services/trip.service");
const logger = require("../logger");

cron.schedule(
  "0 1 * * *",
  async () => {
    logger.log("Auto task create route start", [
      "Batch",
      "Router Daily",
      "None",
    ]);
    await tripService.createAutoTrip();
  },
  {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh",
  }
);

const Hotels = require("../models/Hotels");
const makestring = require("../utils/makestring");

async function updatetables() {
  const today = new Date().toLocaleDateString();
  const currentDate = today.split(",")[0];

  let hotels = await Hotels.find();
  for (let hotel of hotels) {
    if (hotel.lastupdated !== currentDate) {
      let time = hotel.time;
      time = time.split(" - ");
      let starttime = time[0],
        endtime = time[1];
      let Available_Slots = makestring(starttime, endtime, hotel.no_of_tables);

      await Hotels.updateOne(
        { _id: hotel._id },
        { lastupdated: currentDate, Available_Slots }
      );
    }
  }
}

async function updatetablesMiddleware(req, res, next) {
  try {
    await updatetables();
    // console.log("Updated");
    next();
  } catch (error) {
    console.error("Error updating tables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = updatetablesMiddleware;

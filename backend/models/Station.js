const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
    name: String
});

module.exports = mongoose.model("Station", stationSchema);
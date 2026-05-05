const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
    name: String,
    city: String
});

module.exports = mongoose.model("Station", stationSchema);
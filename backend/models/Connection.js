const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
    from: String,
    to: String,
    date: Date,
    departureTime: String,
    arrivalTime: String,
    duration: Number,
    price: Number,
    changes: Number
});

module.exports = mongoose.model("Connection", connectionSchema);
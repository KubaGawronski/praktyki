const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("Mongo error:", err));

app.get("/", (req, res) => {
    res.send("API działa 🚆");
});

app.listen(3001, () => {
    console.log("Server 3001");
});
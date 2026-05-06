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

const Connection = require("./models/Connection");

app.get("/connections", async (req, res) => {
    const data = await Connection.find();
    res.json(data);
});

app.post("/connections", async (req, res) => {
    try {
        const newConnection = new Connection(req.body);
        await newConnection.save();
        res.status(201).json(newConnection);
    } catch (err) {
        res.status(500).json({ error: "Błąd zapisu" });
    }
});

app.get("/add-test", async (req, res) => {
    const test = new Connection({
        from: "Warszawa",
        to: "Kraków",
        date: "2025-05-02",
        departureTime: "08:00",
        arrivalTime: "11:00",
        duration: 180,
        price: 120,
        changes: 0
    });

    await test.save();
    res.send("Dodano!");
});

app.listen(3001, () => {
    console.log("Server 3001");
});
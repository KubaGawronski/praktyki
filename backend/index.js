const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const stationsCollection = db.collection("stations");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("Mongo error:", err));

app.get("/", (req, res) => {
    res.send("API działa 🚆");
});

const Connection = require("./models/Connection");

app.get("/connections", async (req, res) => {
    try {
        const { from, to, date, sort } = req.query;

        const query = {};

        if (from) query.from = from;
        if (to) query.to = to;
        if (date) query.date = date;

        let sortOption = {};

        if (sort === "price") sortOption.price = 1;
        if (sort === "duration") sortOption.duration = 1;

        const connections = await Connection.find(query).sort(sortOption);

        res.json(connections);
    } catch (err) {
        res.status(500).json({ error: "Błąd pobierania danych" });
    }
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

app.delete("/connections/:id", async (req, res) => {
    try {
        await Connection.findByIdAndDelete(req.params.id);
        res.json({ message: "Usunięto połączenie" });
    } catch (err) {
        res.status(500).json({ error: "Błąd usuwania" });
    }
});

app.put("/connections/:id", async (req, res) => {
    try {
        const updated = await Connection.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Błąd edycji" });
    }
});

app.get("/stations", async (req, res) => {
    const stations = await stationsCollection.find().toArray();

    res.json(stations);
});

app.listen(3001, () => {
    console.log("Server 3001");
});
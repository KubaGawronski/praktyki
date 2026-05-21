const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PDFDocument = require("pdfkit");
require("dotenv").config();
const Connection = require("./models/Connection");
const Station = require("./models/Station");
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("Mongo error:", err));

app.get("/", (req, res) => {
    res.send("API działa 🚆");
});

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
    try {
        const stations = await Station.find();

        res.json(stations);
    } catch (err) {
        res.status(500).json({ error: "Błąd pobierania stacji" });
    }
});

app.get("/pdf", async (req, res) => {
    try {
        const { station } = req.query;

        const connections = await Connection.find({
            $or: [
                { from: station },
                { to: station }
            ]
        });

        const doc = new PDFDocument();

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=rozklad-${station}.pdf`
        );

        doc.pipe(res);

        doc
            .fontSize(22)
            .text(`Rozkład jazdy dla stacji: ${station}`);

        doc.moveDown();

        connections.forEach((conn) => {
            doc
                .fontSize(14)
                .text(
                    `${conn.from} → ${conn.to}`
                );

            doc.text(
                `Data: ${conn.date}`
            );

            doc.text(
                `${conn.departureTime} - ${conn.arrivalTime}`
            );

            doc.text(
                `Cena: ${conn.price} zł`
            );

            doc.text(
                `Przesiadki: ${conn.changes}`
            );

            doc.moveDown();
        });

        doc.end();

    } catch (err) {
        res.status(500).json({
            error: "Błąd generowania PDF"
        });
    }
});

app.listen(3001, () => {
    console.log("Server 3001");
});
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
        const path = require("path");

        const { station } = req.query;

        const arrivals = await Connection.find({
            to: station
        });

        const departures = await Connection.find({
            from: station
        });

        const doc = new PDFDocument({
            margin: 40,
            size: "A4"
        });

        const regularFont = path.join(
            __dirname,
            "fonts",
            "DejaVuSans.ttf"
        );

        const boldFont = path.join(
            __dirname,
            "fonts",
            "DejaVuSans-Bold.ttf"
        );

        doc.registerFont("Regular", regularFont);
        doc.registerFont("Bold", boldFont);

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=rozklad-${station}.pdf`
        );

        doc.pipe(res);

        const formatDate = (date) => {
            return new Date(date)
                .toLocaleDateString("pl-PL");
        };

        doc
            .font("Bold")
            .fontSize(24)
            .text(`Rozkład jazdy - ${station}`, {
                align: "center"
            });

        doc.moveDown(2);

        doc
            .font("Bold")
            .fontSize(18)
            .text("PRZYJAZDY", 40);

        doc.moveDown(0.5);

        doc
            .fontSize(12)
            .text(
                "Skąd",
                40,
                doc.y,
                { width: 150 }
            );

        doc.text(
            "Data",
            200,
            doc.y - 14,
            { width: 120 }
        );

        doc.text(
            "Godzina przyjazdu",
            320,
            doc.y - 14,
            { width: 180 }
        );

        doc.moveDown();

        doc
            .moveTo(40, doc.y)
            .lineTo(550, doc.y)
            .stroke();

        doc.moveDown(0.5);

        doc.font("Regular");

        arrivals.forEach((conn) => {
            const currentY = doc.y;

            doc.text(
                conn.from,
                40,
                currentY,
                { width: 150 }
            );

            doc.text(
                formatDate(conn.date),
                200,
                currentY,
                { width: 120 }
            );

            doc.text(
                conn.arrivalTime,
                320,
                currentY,
                { width: 180 }
            );

            doc.moveDown();
        });

        doc.moveDown(2);

        doc
            .font("Bold")
            .fontSize(18)
            .text("ODJAZDY", 40);

        doc.moveDown(0.5);

        doc
            .fontSize(12)
            .text(
                "Dokąd",
                40,
                doc.y,
                { width: 100 }
            );

        doc.text(
            "Data",
            130,
            doc.y - 14,
            { width: 90 }
        );

        doc.text(
            "Odjazd",
            220,
            doc.y - 14,
            { width: 70 }
        );

        doc.text(
            "Przyjazd",
            300,
            doc.y - 14,
            { width: 80 }
        );

        doc.text(
            "Cena",
            390,
            doc.y - 14,
            { width: 60 }
        );

        doc.text(
            "Przesiadki",
            460,
            doc.y - 14,
            { width: 90 }
        );

        doc.moveDown();

        doc
            .moveTo(40, doc.y)
            .lineTo(550, doc.y)
            .stroke();

        doc.moveDown(0.5);

        doc.font("Regular");

        departures.forEach((conn) => {
            const currentY = doc.y;

            doc.text(
                conn.to,
                40,
                currentY,
                { width: 100 }
            );

            doc.text(
                formatDate(conn.date),
                130,
                currentY,
                { width: 90 }
            );

            doc.text(
                conn.departureTime,
                220,
                currentY,
                { width: 70 }
            );

            doc.text(
                conn.arrivalTime,
                300,
                currentY,
                { width: 80 }
            );

            doc.text(
                `${conn.price} zł`,
                390,
                currentY,
                { width: 60 }
            );

            doc.text(
                String(conn.changes),
                460,
                currentY,
                { width: 90 }
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
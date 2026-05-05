const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("API działa 🚆");
});

app.listen(3001, () => console.log("Server 3001"));
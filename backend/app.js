const express = require("express");
const db = require('./db');
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.get('/data', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Serwer działa poprawnie!",
        time: new Date().toISOString()
    });
});
// Endpoint do odbioru danych
app.post("/data", async (req, res) => {
    try {
        let cardId = req.body.card_id.trim();
        if (!cardId) {
            return res.status(400).json({error: "Brak card_id w żądaniu"});
        }

        const [rows] = await db.query(
            "SELECT * FROM users WHERE card_id = ?",
            [cardId]
        );
        if(rows.length === 0){
            return res.status(404).json({error: "Nie znaleziono użytkowanika"});
        }
        console.log("Otrzymane dane:", rows[0]);
        res.status(200).json(rows[0]);
    } catch (error){
        console.error("Błąd zapytania do bazy: ", error);
        res.status(500).json({ error: "Błąd serwera"});
    }

});

module.exports = app; // Zamiast app.listen() eksportujemy aplikację
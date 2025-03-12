const express = require('express');
const {getUserByCardIdAndIdPar, getServicesByTimeStamp} = require('./db')
const router = express.Router();

router.get('/data', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Serwer działa poprawnie!",
        time: new Date().toISOString()
    });
});
// Endpoint do odbioru danych
router.post("/data", async (req, res) => {
    let result;
    try {
        const {card_id, timestamp, id_par} = req.body;
        result = await getUserByCardIdAndIdPar(card_id, id_par);
        if(result !== null){
            getServicesByTimeStamp(timestamp,id_par);
             res.status(200).json(result);
        }else{
            res.status(400).json("Brak użytkownika w bazie");
        }

    } catch (error) {
        console.error("Błąd zapytania do bazy: ", error);
        res.status(500).json({error: "Błąd serwera"});
    }

});
module.exports = router;
const express = require('express');
const {getUserByCardIdAndIdPar, getServicesByTimeStamp, addReading, addOtherReading} = require('./db')
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

    try {
        const {card_id, timestamp, id_par} = req.body;
        console.log(card_id,timestamp,id_par)
        const person = await getUserByCardIdAndIdPar(card_id, id_par);
        if(person !== null){
            const service = await getServicesByTimeStamp(timestamp,id_par);
            if(service!==null) {
                const {name, time_service, points} = service;
                const {card_id} = person;
                const serviceAdded = await addReading(card_id, timestamp, name, time_service, id_par);
                if(serviceAdded){
                    const result = {
                        name: name,
                        time: time_service,
                        points: points,
                        message: "Dodano"
                    };
                    res.status(200).json(result);
                }else {
                    res.status(501).json({name: "Duplikat !!!",
                    message: "Już odczytałeś swoją kartę"});
                }
            }else {
                const serviceAdded = await  addOtherReading(card_id,timestamp, id_par);
                if(serviceAdded) {
                    res.status(200).json(serviceAdded);
                }else {
                    res.status(501).json({name: "Duplikat !!!",
                        message: "Już odczytałeś swoją kartę"});
                }
            }

        }else{
            res.status(400).json("Brak użytkownika w bazie");
        }

    } catch (error) {
        console.error("Błąd zapytania do bazy: ", error);
        res.status(500).json({error: "Błąd serwera"});
    }

});
module.exports = router;
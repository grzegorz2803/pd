const express = require('express');
const {getUserByCardIdAndIdPar, getServicesByTimeStamp, addReading, addOtherReading, checkDatabaseConnection, checkIfTableExists, updateOrInsertPoints} = require('./db')
const router = express.Router();

router.get('/data', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Serwer działa poprawnie!",
        time: new Date().toISOString()
    });
});
router.get('/calendar/today',(req,res)=>{
   res.status(200).json({

        "date": "7 maj 2025",
        "dayName": "Środa",
        "celebrations": [
        {
            "name": "Dzień powszedni",
            "color": "biały",
            "sigla": "1 P 5, 5b-14; Ps 89; Mk 16, 15-20",
            "note": "Ewangelista i towarzysz św. Pawła"
        }
    ]

   });
});
router.get('/calendar/week', (req, res)=>{
    res.status(200).json(
        [
            {
                "date": "2025-05-08",
                "dayName": "Czwartek",
                "celebrations": [
                    {
                        "name": "Wspomnienie św. Stanisława Kazimierczyka",
                        "color": "biały",
                        "sigla": "Dz 13, 13-25; Ps 89; J 13, 16-20"
                    }
                ]
            },
            {
                "date": "2025-05-09",
                "dayName": "Piątek",
                "celebrations": [
                    {
                        "name": "Dzień powszedni",
                        "color": "zielony"
                    }
                ]
            },
            {
                "date": "2025-05-10",
                "dayName": "Sobota",
                "celebrations": [
                    {
                        "name": "Wspomnienie NMP",
                        "color": "biały",
                        "sigla": "Dz 13, 44-52; Ps 98; J 14, 7-14"
                    }
                ]
            },
            {
                "date": "2025-05-11",
                "dayName": "Niedziela",
                "celebrations": [
                    {
                        "name": "VI Niedziela Wielkanocna",
                        "color": "biały",
                        "sigla": "Dz 10, 25-26. 34-35. 44-48; Ps 98; 1 J 4, 7-10; J 15, 9-17"
                    }
                ]
            },
            {
                "date": "2025-05-12",
                "dayName": "Poniedziałek",
                "celebrations": [
                    {
                        "name": "Wspomnienie św. Pankracego, męczennika",
                        "color": "czerwony",
                        "sigla": "Dz 16, 11-15; Ps 149; J 15, 26 – 16, 4a"
                    }
                ]
            },
            {
                "date": "2025-05-13",
                "dayName": "Wtorek",
                "celebrations": [
                    {
                        "name": "Wspomnienie Matki Bożej Fatimskiej",
                        "color": "biały",
                        "note": "Objawienia w Fatimie, 1917"
                    }
                ]
            }
        ]
    );
});
// Endpoint do odbioru danych
router.post("/data", async (req, res) => {

    try {
        const {card_id, timestamp, id_par} = req.body;
        console.log(card_id,timestamp,id_par)
        if(await checkDatabaseConnection()) {
            const person = await getUserByCardIdAndIdPar(card_id, id_par);
            if (person !== null) {
                const service = await getServicesByTimeStamp(timestamp, id_par);
                if (service !== null) {
                    const {name, time_service, points} = service;
                    const {card_id} = person;
                    const serviceAdded = await addReading(card_id, timestamp, name, time_service, id_par);
                    if (serviceAdded) {
                        try{
                            await checkIfTableExists(id_par);
                            await updateOrInsertPoints(card_id,points,id_par);
                            const result = {
                                name: name,
                                time: time_service,
                                points: points,
                                message: "Dodano"
                            };
                            res.status(200).json(result);
                        }catch (error){
                            res.status(500).json({error: "Błąd serwera"});
                        }
                    } else {
                        res.status(501).json({
                            name: "Duplikat !!!",
                            message: "Już odczytałeś swoją kartę"
                        });
                    }
                } else {
                    const serviceAdded = await addOtherReading(card_id, timestamp, id_par);
                    if (serviceAdded) {
                        try{
                            await checkIfTableExists(id_par);
                            await updateOrInsertPoints(card_id,5,id_par);
                        res.status(200).json(serviceAdded);
                        }catch (error){
                            res.status(500).json({error: "Błąd serwera"});
                        }
                    } else {
                        res.status(501).json({
                            name: "Duplikat !!!",
                            message: "Już odczytałeś swoją kartę"
                        });
                    }
                }

            } else {
                res.status(502).json({
                    name: "Brak użytkownika w bazie",
                    message: "Skontaktuj się ze swoim opiekunem."
                });
            }
        }else {
            res.status(503).json( {name: "Brak połączenia z bazą danych"});
        }
    } catch (error) {
      //  console.error("Błąd zapytania do bazy: ", error);
        res.status(500).json({error: "Błąd serwera"});
        console.log("Rzucono wyjątek");
    }

});
module.exports = router;
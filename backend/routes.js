const express = require('express');
const {
    getUserByCardIdAndIdPar,
    getServicesByTimeStamp,
    addReading,
    addOtherReading,
    checkDatabaseConnection,
    checkIfTableExists,
    updateOrInsertPoints,
    getLiturgicalDataToday,
    getLiturgicalDataWeek,
    getAboutApp,
    authorization,
    updateEmail,
    verificationCode,
    newPassword,
    registerDeviceToken,
    logout,
    refreshTokenF,
    getProfilData,
    getRankingData,
    getHistoryData,
    sendJustificationText
} = require('./db')
const {log} = require("debug");
const router = express.Router();
const authenticateToken = require('./middleware/authenticateToken');
router.get('/data', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Serwer działa poprawnie!",
        time: new Date().toISOString()
    });
});

router.get('/calendar/today', async (req, res) => {
    const result = await getLiturgicalDataToday();

    res.status(200).json(result);
});
router.get('/calendar/week', async (req, res) => {
  const result = await getLiturgicalDataWeek();
  res.status(200).json(result);
});

router.get('/about/:version', async (req, res) => {
    const versionApp = req.params.version;
    const result = await getAboutApp(versionApp);
    res.status(200).json(result);
});
// Endpoint do odbioru danych
router.post("/data", async (req, res) => {

    try {
        const {card_id, timestamp, id_par} = req.body;
        console.log(card_id, timestamp, id_par)
        if (await checkDatabaseConnection()) {
            const person = await getUserByCardIdAndIdPar(card_id, id_par);
            if (person !== null) {
                const service = await getServicesByTimeStamp(timestamp, id_par);
                if (service !== null) {
                    const {name, time_service, points} = service;
                    const {card_id} = person;
                    const serviceAdded = await addReading(card_id, timestamp, name, time_service,points, id_par);
                    if (serviceAdded) {
                        try {
                            await checkIfTableExists(id_par);
                            await updateOrInsertPoints(card_id, points, id_par);
                            const result = {
                                name: name,
                                time: time_service,
                                points: points,
                                message: "Dodano"
                            };
                            res.status(200).json(result);
                        } catch (error) {
                            res.status(500).json({error: "Błąd serwera"});
                        }
                    } else {
                        res.status(501).json({
                            name: "Duplikat !!!",
                            message: "Już odczytałeś swoją kartę"
                        });
                    }
                } else {
                    const serviceAdded = await addOtherReading(card_id, timestamp, 5,id_par);
                    if (serviceAdded) {
                        try {
                            await checkIfTableExists(id_par);
                            await updateOrInsertPoints(card_id, 5, id_par);
                            res.status(200).json(serviceAdded);
                        } catch (error) {
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
        } else {
            res.status(503).json({name: "Brak połączenia z bazą danych"});
        }
    } catch (error) {
        //  console.error("Błąd zapytania do bazy: ", error);
        res.status(500).json({error: "Błąd serwera"});
        console.log("Rzucono wyjątek");
    }

});
router.post("/login", async (req,res  ) => {
  const {login, password, appType} = req.body;

  if(!login || !password){
      return res.status(400).json({message: 'Brak loginu lub hasła'});
  }
  await  authorization(login,password,appType, res);
});
router.post("/send-verification-code", authenticateToken,  async (req,res) => {
const userId = req.user.id;
const {email} = req.body;

if(!email){
  return res.status(400).json({success: false, message: 'Brak adresu e-mail'});
}
await updateEmail(userId, email, res);

})
router.post("/verify-code",authenticateToken, async (req,res) => {
    const userId = req.user.id;
    const {code} = req.body;
   if(!code){
       return res.status(400).json({success: false, message: 'Brak kodu'});
   }
   await verificationCode(userId, code, res);
})
router.post("/new-password", authenticateToken, async (req,res) => {
    const userId = req.user.id;
    const {password} = req.body;
    if(!password){
        return res.status(400).json({success: false, message: 'Brak hasła'});
    }
    await newPassword(userId, password, res);
})
router.post("/device/register", authenticateToken, async (req,res)=>{
const {device_token, platform, app_version} = req.body;
if(!device_token || !platform){
    return res.status(400).json({error: "Brak wymaganych danych"});
}
const cardId = req.user.card_id;
await registerDeviceToken(cardId, device_token, platform, app_version, res);
})
router.post("/logout",async (req,res)=>{
    const {refreshToken, appType} = req.body;
    await logout(refreshToken,appType,res);
})
router.post("/refresh-token", async (req, res)=>{
    const {refreshToken, appType} = req.body;
    if(!refreshToken){
        return res.status(400).json({message: "Brak refresh tokena"});
    }
    console.log("wystawiamy nowy token jwt");
    await  refreshTokenF(refreshToken, appType,res);
})
router.post("/get-profil-data",authenticateToken,async (req,res)=>{
    const cardId = req.user.card_id;
     await getProfilData(cardId, res);
})
router.post("/get-ranking",authenticateToken, async (req, res)=> {
const  cardId = req.user.card_id;

await getRankingData(cardId,res);
})
router.post("/get-history",authenticateToken, async (req, res)=> {
     const  cardId = req.user.card_id;

    await getHistoryData(cardId,res);
})
router.post("/send-justification-text",authenticateToken,async (req,res)=>{
    const cardId = req.user.card_id;
    const {reading_id, message} = req.body;

    console.log(cardId,reading_id,message);
    await sendJustificationText(cardId,reading_id,message,res);
})
module.exports = router;
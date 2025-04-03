const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'g_admin',
    password: 'zaq1@WSX',
    database: 'lso',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
async function checkDatabaseConnection() {
    try{
        const connection = await pool.getConnection();
        connection.release();
        return true;
    }catch (error){
        return false;
    }
}
async function getUserByCardIdAndIdPar(cardID, parID) {
    try {
        const query = "SELECT * FROM users WHERE card_id = ? AND id_parish = ?";
        const [rows] = await pool.execute(query, [cardID, parID]);
        return rows[0] !==undefined ? rows[0]: null ;
    } catch (error) {
        console.error("Błąd znalezienia usera:", error);
        throw error;
    }
}

async function getServicesByTimeStamp(timeStamp, parID){
    const [selected_date, selected_time] = timeStamp.split(" ");
    const newTime_0 = subtractMinutes(selected_time, 15);
    const newTime_1 = subtractMinutes(selected_time, -15);
  //  console.log(newTime_0);
  //  console.log(newTime_1);
    const tableName = `${parID}_services`;
        const query = `
    SELECT name, time_service, points  FROM \`${tableName}\`
    WHERE 
       (
            (date_service = ? AND time_service BETWEEN ? AND ?
                AND day_of_month IS NULL AND day_of_week IS NULL AND month_from IS NULL AND month_to IS NULL 
                AND first_friday = FALSE AND first_saturday = FALSE
            )
         
            OR (
                day_of_month = DAY(?) 
                AND MONTH(?) BETWEEN month_from AND month_to
                AND time_service BETWEEN ? AND ?
                AND date_service IS NULL AND day_of_week IS NULL AND first_friday = FALSE AND first_saturday = FALSE 
            )

            OR (
                ( first_friday = TRUE OR first_saturday = TRUE) 
                AND day_of_week = DAYOFWEEK(?) - 1
                AND time_service BETWEEN ? AND ?
                AND DAY(?) <= 7
                AND date_service IS NULL AND day_of_month IS NULL AND month_from IS NULL AND month_to IS NULL
            )

            OR (
                day_of_month = DAY(?) 
                AND time_service BETWEEN ? AND ?
                AND date_service IS NULL AND day_of_week IS NULL AND month_from IS NULL AND month_to IS NULL 
                AND first_friday = FALSE AND first_saturday = FALSE 
            )

            OR (
                day_of_week = DAYOFWEEK(?) - 1 
                AND MONTH(?) BETWEEN month_from AND month_to
                AND day_of_month = DAY(?) 
                AND time_service BETWEEN ? AND ?
                AND date_service IS NULL  AND first_friday = FALSE AND first_saturday = FALSE 
            )

            OR (
                day_of_week = DAYOFWEEK(?) - 1 
                AND MONTH(?) BETWEEN month_from AND month_to
                AND time_service BETWEEN ? AND ?
                AND date_service IS NULL AND day_of_month IS NULL AND first_friday = FALSE AND first_saturday = FALSE 
            )

            OR (
                time_service BETWEEN ? AND ?
                AND MONTH(?) BETWEEN month_from AND month_to
                AND DAYOFWEEK(?) != 1
                AND date_service IS NULL AND day_of_month IS NULL  AND first_friday = FALSE AND first_saturday = FALSE 
                AND day_of_week IS NULL
            )

            OR (
                day_of_week = DAYOFWEEK(?) - 1 
                AND time_service BETWEEN ? AND ?
                AND date_service IS NULL AND day_of_month IS NULL AND month_from IS NULL AND month_to IS NULL 
                AND first_friday = FALSE AND first_saturday = FALSE 
            )

            OR (
                time_service BETWEEN ? AND ?
                AND date_service IS NULL AND day_of_week IS NULL AND day_of_month IS NULL 
                AND month_from IS NULL AND month_to IS NULL AND first_friday = FALSE AND first_saturday = FALSE 
            )
        )
    ORDER BY priority ASC  
    LIMIT 1;
    `;

        try {
            const [rows] = await pool.execute(query, [
                selected_date, newTime_0,newTime_1, selected_date, selected_date, newTime_0, newTime_1, selected_date,
                newTime_0, newTime_1, selected_date, selected_date, newTime_0, newTime_1, selected_date, selected_date,
                selected_date, newTime_0, newTime_1, selected_date, selected_date, newTime_0, newTime_1, newTime_0, newTime_1,
                selected_date, selected_date, selected_date,newTime_0, newTime_1, newTime_0, newTime_1
            ]);
          //  console.log(rows);
            return rows[0] !==undefined ? rows[0]: null ;
    }catch (error) {
      //  console.error("Błąd wyszukania nabożeństwa w bazie danych:", error);
        throw error;
    }

}

async function addReading(cardId, timeStamp, nameService, timeService, idPar){
    const [date, time] = timeStamp.split(" ");
    const tableName = `${idPar}_readings`;
    const duplicate = await checkDuplicateReading(cardId,date,timeService,tableName,true);
    //console.log(cardId, date, time, nameService, timeService, idPar, tableName );
    if(!duplicate)
    {
        const query = `INSERT INTO \`${tableName}\` (card_id, date_read, time_read, name_service, time_service)
                       VALUES (?, ?, ?, ?, ?)`;
        try {
            const [result] = await pool.execute(query, [cardId, date, time, nameService, timeService]);
            return result.affectedRows === 1;
        } catch (error) {
            console.error("Błąd dodania odczytu", error);
            throw error;
        }
    }else {
        return false;
    }
}

async function addOtherReading(cardId, timeStamp, idPar){
        const [date, time] = timeStamp.split(" ");
        const tableName = `${idPar}_readings`;
        const duplicate = await checkDuplicateReading(cardId,date,time,tableName);
        if(!duplicate) {
            const query = `INSERT INTO \`${tableName}\` (card_id, date_read, time_read, name_service, time_service)
                           VALUES (?, ?, ?, 'Inne nabożeństwo', ?)`;
            try {
                const [result] = await pool.execute(query, [cardId, date, time, time]);
                if (result.affectedRows === 1) {
                    return {
                        name: "Inne nabożeństwo",
                        time: time,
                        points: 5,
                        message: "Nieznane nabożeństwo"
                    }
                }
            } catch (error) {
                console.error("Nie udało sie dodać", error);
                throw error;
            }
        }else{
            return false;
        }
}
async function checkDuplicateReading(cardId, dateRead, timeService, tableName, flag=false){
    let query;
    let params;
    const newTime_0 = subtractMinutes(timeService, 45);
    const newTime_1 = subtractMinutes(timeService, -45);
    if (flag) {
        query = `SELECT COUNT(*) AS count
                 FROM \`${tableName}\`
                 WHERE card_id=? AND date_read=? AND time_service=?`;
        params = [cardId, dateRead, timeService];
    } else {
        query = `SELECT COUNT(*) AS count
                 FROM \`${tableName}\`
                 WHERE card_id=? AND date_read=? AND time_service BETWEEN ? AND ?`;
        params = [cardId, dateRead, newTime_0, newTime_1];
    }
    try{
        const [result] = await pool.execute(query,params);
        console.log(result[0].count);
        return result[0].count >0;
    }catch(error){
        console.error("Błąd wyszukiwania duplikatu", error);
        throw error;
    }
}
async function checkIfTableExists(idPar){
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() +1).padStart(2,'0');

  const tableYear = `${idPar}_${year}`;
  const tableMonthYear = `${idPar}_${month}_${year}`;

  const tablesToCheck = [tableYear, tableMonthYear];

  const createTableSQL = (tableName) => `
  CREATE TABLE IF NOT EXISTS \`${tableName}\` (
    card_id VARCHAR(20) PRIMARY KEY NOT NULL,
    points INT DEFAULT 0,
    points_meating INT DEFAULT 0,
    sum INT GENERATED ALWAYS AS (points + points_meating) STORED,
    FOREIGN KEY (card_id) REFERENCES users(card_id)
  )
  `;
  const conn = await pool.getConnection();

  try {
      for(const tableName of tablesToCheck){
          const [rows] = await conn.execute(
              `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name =?`,
              [tableName]
          );
          const exists = rows[0].count>0;

          if(!exists){
              console.log(`Tabela ${tableName} nie istnieje. Tworzę ...`);
              await conn.execute(createTableSQL(tableName));
              console.log(`Utworzono tabele ${tableName}`);
          }else {
              console.log(`Tabela ${tableName} już istnieje`);
          }
      }

      }catch(error){
      console.error("Błąd przy sprawdzaniu  lub tworzeniu tabel: ",error);
      throw error;
  }finally {
      conn.release();
  }
}
async function updateOrInsertPoints(cardID, points, parID){
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() +1).padStart(2, '0');
const tables = [
  `${parID}_${year}`,
  `${parID}_${month}_${year}`
];
try{
    for (const tableName of tables){
        const [rows] = await pool.execute(
            `SELECT * FROM \`${tableName}\` WHERE card_id = ?`,
            [cardID]
        );
        console.log(rows[0]);
        if(rows[0] !== undefined){
            await pool.execute(
                `UPDATE \`${tableName}\` SET points = points + ? WHERE card_id = ?`,
                [points,cardID]
            );
            console.log(`Zaktualizowano punkty w tabeli ${tableName}`);
        }else {
            await pool.execute(
                `INSERT INTO \`${tableName}\` (card_id, points, points_meating) VALUES (?,?,0)`,
                [cardID, points]
            );
            console.log(`Dodano wpis do tabeli ${tableName}`);
        }
    }
}catch (error){
    console.error('Błąd aktualizacji punktów', error);
    throw error;
}
}
function subtractMinutes(timeString, minutesToSubtract) {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes - minutesToSubtract);

    return date.toTimeString().slice(0, 8); // Format HH:MM:SS
}
module.exports = {getUserByCardIdAndIdPar, getServicesByTimeStamp, addReading, addOtherReading, checkDatabaseConnection, checkIfTableExists, updateOrInsertPoints};
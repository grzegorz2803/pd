const mysql = require('mysql2/promise');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});
dayjs.extend(utc);
dayjs.extend(timezone);

async function checkDatabaseConnection() {
    try {
        const connection = await pool.getConnection();
        connection.release();
        return true;
    } catch (error) {
        return false;
    }
}

async function getUserByCardIdAndIdPar(cardID, parID) {
    try {
        const query = "SELECT * FROM users WHERE card_id = ? AND id_parish = ?";
        const [rows] = await pool.execute(query, [cardID, parID]);
        return rows[0] !== undefined ? rows[0] : null;
    } catch (error) {
        console.error("Błąd znalezienia usera:", error);
        throw error;
    }
}

async function getServicesByTimeStamp(timeStamp, parID) {
    const [selected_date, selected_time] = timeStamp.split(" ");
    const newTime_0 = subtractMinutes(selected_time, 15);
    const newTime_1 = subtractMinutes(selected_time, -15);
    //  console.log(newTime_0);
    //  console.log(newTime_1);
    const tableName = `${parID}_services`;
    const query = `
        SELECT name, time_service, points
        FROM \`${tableName}\`
        WHERE (
                  (date_service = ? AND time_service BETWEEN ? AND ?
                      AND day_of_month IS NULL AND day_of_week IS NULL AND month_from IS NULL AND month_to IS NULL
                      AND first_friday = FALSE AND first_saturday = FALSE
                      )
                      OR (
                      day_of_month = DAY (?)
                          AND MONTH (?) BETWEEN month_from AND month_to
                          AND time_service BETWEEN ? AND ?
                          AND date_service IS NULL AND day_of_week IS NULL AND first_friday = FALSE AND
                      first_saturday = FALSE
                      )
                      OR (
                      (first_friday = TRUE OR first_saturday = TRUE)
                          AND day_of_week = DAYOFWEEK(?) - 1
                          AND time_service BETWEEN ? AND ?
                          AND DAY (?) <= 7
                          AND date_service IS NULL AND day_of_month IS NULL AND month_from IS NULL AND month_to IS NULL
                      )
                      OR (
                      day_of_month = DAY (?)
                          AND time_service BETWEEN ? AND ?
                          AND date_service IS NULL AND day_of_week IS NULL AND month_from IS NULL AND month_to IS NULL
                          AND first_friday = FALSE AND first_saturday = FALSE
                      )
                      OR (
                      day_of_week = DAYOFWEEK(?) - 1
                          AND MONTH (?) BETWEEN month_from AND month_to
                          AND day_of_month = DAY (?)
                          AND time_service BETWEEN ? AND ?
                          AND date_service IS NULL AND first_friday = FALSE AND first_saturday = FALSE
                      )
                      OR (
                      day_of_week = DAYOFWEEK(?) - 1
                          AND MONTH (?) BETWEEN month_from AND month_to
                          AND time_service BETWEEN ? AND ?
                          AND date_service IS NULL AND day_of_month IS NULL AND first_friday = FALSE AND
                      first_saturday = FALSE
                      )
                      OR (
                      time_service BETWEEN ? AND ?
                          AND MONTH (?) BETWEEN month_from AND month_to
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
                          AND month_from IS NULL AND month_to IS NULL AND first_friday = FALSE AND
                      first_saturday = FALSE
                      )
                  )
        ORDER BY priority ASC LIMIT 1;
    `;

    try {
        const [rows] = await pool.execute(query, [
            selected_date, newTime_0, newTime_1, selected_date, selected_date, newTime_0, newTime_1, selected_date,
            newTime_0, newTime_1, selected_date, selected_date, newTime_0, newTime_1, selected_date, selected_date,
            selected_date, newTime_0, newTime_1, selected_date, selected_date, newTime_0, newTime_1, newTime_0, newTime_1,
            selected_date, selected_date, selected_date, newTime_0, newTime_1, newTime_0, newTime_1
        ]);
        //  console.log(rows);
        return rows[0] !== undefined ? rows[0] : null;
    } catch (error) {
        //  console.error("Błąd wyszukania nabożeństwa w bazie danych:", error);
        throw error;
    }

}

async function addReading(cardId, timeStamp, nameService, timeService, idPar) {
    const [date, time] = timeStamp.split(" ");
    const tableName = `${idPar}_readings`;
    const duplicate = await checkDuplicateReading(cardId, date, timeService, tableName, true);
    //console.log(cardId, date, time, nameService, timeService, idPar, tableName );
    if (!duplicate) {
        const query = `INSERT INTO \`${tableName}\` (card_id, date_read, time_read, name_service, time_service)
                       VALUES (?, ?, ?, ?, ?)`;
        try {
            const [result] = await pool.execute(query, [cardId, date, time, nameService, timeService]);
            return result.affectedRows === 1;
        } catch (error) {
            console.error("Błąd dodania odczytu", error);
            throw error;
        }
    } else {
        return false;
    }
}

async function addOtherReading(cardId, timeStamp, idPar) {
    const [date, time] = timeStamp.split(" ");
    const tableName = `${idPar}_readings`;
    const duplicate = await checkDuplicateReading(cardId, date, time, tableName);
    if (!duplicate) {
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
    } else {
        return false;
    }
}

async function checkDuplicateReading(cardId, dateRead, timeService, tableName, flag = false) {
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
    try {
        const [result] = await pool.execute(query, params);
        console.log(result[0].count);
        return result[0].count > 0;
    } catch (error) {
        console.error("Błąd wyszukiwania duplikatu", error);
        throw error;
    }
}

async function checkIfTableExists(idPar) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const tableYear = `${idPar}_${year}`;
    const tableMonthYear = `${idPar}_${month}_${year}`;

    const tablesToCheck = [tableYear, tableMonthYear];

    const createTableSQL = (tableName) => `
        CREATE TABLE IF NOT EXISTS \`${tableName}\`
        (
            card_id
            VARCHAR
        (
            20
        ) PRIMARY KEY NOT NULL,
            points INT DEFAULT 0,
            points_meating INT DEFAULT 0,
            sum INT GENERATED ALWAYS AS
        (
            points
            +
            points_meating
        ) STORED,
            FOREIGN KEY
        (
            card_id
        ) REFERENCES users
        (
            card_id
        )
            )
    `;
    const conn = await pool.getConnection();

    try {
        for (const tableName of tablesToCheck) {
            const [rows] = await conn.execute(
                `SELECT COUNT(*) AS count
                 FROM information_schema.tables
                 WHERE table_schema = DATABASE() AND table_name =?`,
                [tableName]
            );
            const exists = rows[0].count > 0;

            if (!exists) {
                console.log(`Tabela ${tableName} nie istnieje. Tworzę ...`);
                await conn.execute(createTableSQL(tableName));
                console.log(`Utworzono tabele ${tableName}`);
            } else {
                console.log(`Tabela ${tableName} już istnieje`);
            }
        }

    } catch (error) {
        console.error("Błąd przy sprawdzaniu  lub tworzeniu tabel: ", error);
        throw error;
    } finally {
        conn.release();
    }
}

async function updateOrInsertPoints(cardID, points, parID) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const tables = [
        `${parID}_${year}`,
        `${parID}_${month}_${year}`
    ];
    try {
        for (const tableName of tables) {
            const [rows] = await pool.execute(
                `SELECT *
                 FROM \`${tableName}\`
                 WHERE card_id = ?`,
                [cardID]
            );
            console.log(rows[0]);
            if (rows[0] !== undefined) {
                await pool.execute(
                    `UPDATE \`${tableName}\`
                     SET points = points + ?
                     WHERE card_id = ?`,
                    [points, cardID]
                );
                console.log(`Zaktualizowano punkty w tabeli ${tableName}`);
            } else {
                await pool.execute(
                    `INSERT INTO \`${tableName}\` (card_id, points, points_meating)
                     VALUES (?, ?, 0)`,
                    [cardID, points]
                );
                console.log(`Dodano wpis do tabeli ${tableName}`);
            }
        }
    } catch (error) {
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


async function getLiturgicalDataToday() {
    const today = dayjs().format('YYYY-MM-DD');
    const query = `SELECT date, day_name, name, color, sigla, notes
                   FROM calendar_tools
                   WHERE date = ?
                   ORDER BY CASE priority_level WHEN 'solemnity' THEN 1
                       WHEN 'feast' THEN 2
                       WHEN 'memorial' THEN 3
                       WHEN 'ferial' THEN 4
                       WHEN 'optional_memorial' THEN 5
                       ELSE 6
    END;`;
    try {
        const [result] = await pool.execute(query, [today]);
        if (result === undefined) {
            return {message: "Brak danych dla tego dnia"};
        }
        const formattedJson = {
            date: dayjs(result[0].date).format('DD-MM-YYYY'),
            dayName: result[0].day_name,
            celebrations: result.map(row => {
                const celebration = {
                    name: row.name,
                    color: row.color
                };
                if (row.sigla) {
                    celebration.sigla = row.sigla;
                }
                if (row.notes) {
                    celebration.notes = row.notes;
                }
                return celebration;
            })
        };
        return formattedJson;
    } catch (error) {
        console.error("Błąd", error);
        throw error;
    }
}

async function getLiturgicalDataWeek() {
    const fromDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
    const toDate = dayjs().add(6, 'day').format('YYYY-MM-DD');

    const query = `SELECT date, day_name, name, color, sigla, notes
                   FROM calendar_tools
                   WHERE date >=? AND date <=?
                   ORDER BY date,
                       CASE priority_level WHEN 'solemnity' THEN 1
                       WHEN 'feast' THEN 2
                       WHEN 'memorial' THEN 3
                       WHEN 'ferial' THEN 4
                       WHEN 'optional_memorial' THEN 5
                       ELSE 6
    END;`;
    try {
        const [rows] = await pool.execute(query, [fromDate, toDate]);
        if (rows === undefined) {
            return {message: "Brak danych dla tego dnia"};
        }
        console.log(dayjs.utc(rows[0].date).tz('Europe/Warsaw').format('DD-MM-YYYY'));
        const groupedByDate = {};

        rows.forEach(row => {
            const formattedDate = dayjs.utc(row.date).tz('Europe/Warsaw').format('DD-MM-YYYY');
            if (!groupedByDate[formattedDate]) {
                groupedByDate[formattedDate] = {
                    date: formattedDate,
                    dayName: row.day_name,
                    celebrations: []
                };
            }
            const celebration = {
                name: row.name,
                color: row.color
            };
            if (row.sigla) celebration.sigla = row.sigla;
            if (row.notes) celebration.note = row.notes;

            groupedByDate[formattedDate].celebrations.push(celebration);
        });
        return Object.values(groupedByDate);
    } catch (error) {
        console.error("Błąd", error);
        throw error;
    }
}

async function getAboutApp(versionApp) {
    const query = `SELECT *
                   FROM about_app
                   WHERE version = ?`;
    try {
        const [result] = await pool.execute(query, [versionApp]);
        return result;
    } catch (error) {
        console.error("Błąd", error);
        throw error;
    }
}

async function authorization(login, password) {
    try {
        const [rows] = await pool.execute(
            'SELECT id_auth, login, password_hash,email,role,user_function, first_login_completed FROM auth WHERE login =?', [login]
        );

        if (rows[0] === undefined) {
            return {success: false, status: 401, message: 'Nieprawidłowy login'};
        }
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return {success: false, status: 401, message: 'Nieprawidłowe hasło'};
        }
        const token = jwt.sign(
            {
                id: user.id_auth,
                login: user.login,
                email: user.email,
                role: user.role,
                function: user.user_function,
                login_completed: user.first_login_completed,
            },
            process.env.JWT_SECRET,
            {expiresIn: '12h'}
        );
        return {
            success: true,
            status: 200,
            message: 'Zalogowano pomyślnie',
            token
        };
    } catch (error) {
        console.error('Błąd logowania', error);
        return {success: false, status: 500, message: 'Błąd serwera'};
    }
}

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function updateEmail(idUser, email, res) {
    try {
        const [rows] = await pool.execute('SELECT id_auth FROM auth WHERE  email = ? AND id_auth !=?', [email, idUser]);
        console.log(rows[0]);
        if (rows[0] !== undefined) {
            return res.status(409).json({
                success: false,
                message: 'Podany adres email jest już używany przez innego użytkownika',
            });
        }
        await pool.execute('UPDATE auth SET email = ? WHERE id_auth= ?', [email, idUser]);
        const verificationCode = generateVerificationCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await transporter.sendMail({
            from: '"LSOgo App" <powiadomienia@lsogo.pl>',
            to: email,
            subject: 'Twój kod weryfikacyjny',
            text: `Twój kod weryfikacyjny to: ${verificationCode}`,
        });
        await pool.execute('INSERT INTO email_verification_codes (user_id, verification_code, expires_at, used) VALUES (?,?,?,0)', [idUser, verificationCode, expiresAt]);
        return res.status(200).json({
            success: true,
            message: 'Kod został wysłany',
        })
    } catch (error) {
        console.error('Błąd podczas aktualizacji e-maila', error);
        return res.status(500).json({
            success: false,
            message: 'Wystąpił błąd serwera',
        });
    }
}

async function verificationCode(userID, code, res) {
    try {
        const [rows] = await pool.execute(`SELECT *
                                           FROM email_verification_codes
                                           WHERE user_id = ?
                                             AND verification_code = ?
                                             AND used = 0
                                             AND expires_at > NOW()
                                           ORDER BY id DESC LIMIT 1`,
            [userID, code]);
        if (rows[0] === undefined) {
            return res.status(400).json({succes: false, message: 'Nieprawidłowy kod lub upłynął czas '});
        }
        const verificationId = rows[0].id;
        await pool.execute(`UPDATE email_verification_codes
                            SET used = 1
                            WHERE id = ?`, [verificationId]);
        return res.status(200).json({success: true, message: 'Email zweryfikowany'});
    } catch (error) {
        console.error('Błąd weryfikacji kodu', error);
        return res.status(500).json({success: false, message: 'Błąd serwera'});
    }
}

module.exports = {
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
    verificationCode
};

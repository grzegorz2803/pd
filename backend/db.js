const mysql = require('mysql2/promise');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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

async function addReading(cardId, timeStamp, nameService, timeService, points, idPar) {
    const [date, time] = timeStamp.split(" ");
    const tableName = `${idPar}_readings`;
    const duplicate = await checkDuplicateReading(cardId, date, timeService, tableName, true);
    console.log(points);
    //console.log(cardId, date, time, nameService, timeService, idPar, tableName );
    if (!duplicate) {
        const query = `INSERT INTO \`${tableName}\` (card_id, date_read, time_read, name_service, time_service, points)
                       VALUES (?, ?, ?, ?, ?, ?)`;
        try {
            const [result] = await pool.execute(query, [cardId, date, time, nameService, timeService, points]);
            return result.affectedRows === 1;
        } catch (error) {
            console.error("Błąd dodania odczytu", error);
            throw error;
        }
    } else {
        return false;
    }
}

async function addOtherReading(cardId, timeStamp, points, idPar) {
    const [date, time] = timeStamp.split(" ");
    const tableName = `${idPar}_readings`;
    const duplicate = await checkDuplicateReading(cardId, date, time, tableName);
    if (!duplicate) {
        const query = `INSERT INTO \`${tableName}\` (card_id, date_read, time_read, name_service, time_service, points)
                       VALUES (?, ?, ?, 'Inne nabożeństwo', ?, ?)`;
        try {
            const [result] = await pool.execute(query, [cardId, date, time, time, points]);
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

async function authorization(login, password, appType, res) {
    try {
        const [rows] = await pool.execute(
            'SELECT id_auth, card_id, login, password_hash,email,role,user_function, first_login_completed FROM auth WHERE login =?', [login]
        );

        if (rows[0] === undefined) {
            return res.status(401).json({success: false, status: 401, message: 'Nieprawidłowy login'});
        }
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({success: false, status: 401, message: 'Nieprawidłowe hasło'});
        }
        const token = jwt.sign(
            {
                id: user.id_auth,
                card_id: user.card_id,
                login: user.login,
                email: user.email,
                role: user.role,
                function: user.user_function,
                login_completed: user.first_login_completed,
            },
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
        const refreshToken = crypto.randomBytes(64).toString('hex');
        const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const expirestAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        await pool.execute('DELETE FROM refresh_tokens WHERE card_id = ? AND appType=?', [user.card_id, appType]);
        await pool.execute('INSERT INTO refresh_tokens (card_id, token, expires_at, appType) VALUES (?,?,?,?)', [user.card_id, hashedRefreshToken, expirestAt, appType]);

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Zalogowano pomyślnie',
            token,
            refreshToken
        });
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

async function newPassword(userId, password, res) {
    try {
        const hash = await bcrypt.hash(password, 10);
        await pool.execute(`UPDATE auth
                            SET password_hash         = ?,
                                first_login_completed = 1,
                                is_email_verified     = 1
                            WHERE id_auth = ?`, [hash, userId]);
        return res.status(200).json({success: true, message: 'Hasło zostało ustawione'});
    } catch (error) {
        console.error('Błąd przy zmianie hasła', error);
        return res.status(500).json({success: false, message: 'Błąd serwera przy zmianie hasła'});
    }
}

async function registerDeviceToken(cardId, device_token, platform, app_version, res) {
    try {
        await pool.execute(`INSERT INTO device_tokens (card_id, device_token, platform, app_version, created_at)
                            VALUES (?, ?, ?, ?, NOW()) ON DUPLICATE KEY
                UPDATE platform=?, app_version=?, created_at=NOW()`,
            [cardId, device_token, platform, app_version, platform, app_version]);
        res.status(200).json({message: "Token zapisany pomyślnie"});
    } catch (error) {
        console.error("Błąd zapisu tokenu:", error);
        res.status(500).json({error: "Błąd serwera podczas zapisu tokenu"});
    }
}

async function logout(refreshToken, appType, res) {
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    try {

        await pool.execute('DELETE FROM refresh_tokens WHERE token =? AND appType =? ', [hashedRefreshToken, appType]);
        res.status(200).json({message: "Token zopisany poprawnie"});
    } catch (error) {
        console.error("Błąd usunięcia tokenu:", error);
        res.status(500).json({error: "Błąd serwera podczas usunięcia tokenu"});
    }
}

async function refreshTokenF(refreshToken, appType, res) {
    try {
        const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

        const [rows] = await pool.execute("SELECT card_id, expires_at FROM refresh_tokens WHERE token=? AND appType=?", [hashedToken, appType]);
        if (rows[0] === undefined) {
            return res.status(403).json({message: "Nieprawidłowy lub nieważny token"});
        }
        const tokenEntry = rows[0];
        const now = new Date();

        if (new Date(tokenEntry.expires_at) < now) {
            return res.status(403).json({message: "Token wygasł"});
        }
        const cardId = tokenEntry.card_id;
        const [userRows] = await pool.execute(
            'SELECT id_auth, card_id, login, password_hash,email,role,user_function, first_login_completed FROM auth WHERE card_id=?', [cardId]
        );
        const user = userRows[0];
        if (!user) {
            return res.status(404).json({message: "Użytkownik nie istnieje "});

        }
        const newAccessToken = jwt.sign(
            {
                id: user.id_auth,
                card_id: user.card_id,
                login: user.login,
                email: user.email,
                role: user.role,
                function: user.user_function,
                login_completed: user.first_login_completed,
            },
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
        return res.json({
            token: newAccessToken,
        });
    } catch (error) {
        console.error("Błąd odświeżania tokena:", error);
        return res.status(500).json({message: "Błąd serwera"});
    }
}

async function getProfilData(cardId, res) {
    try {
        const result = await pool.execute(`SELECT u.first_name,
                                                  u.last_name,
                                                  p.name     AS parish_name,
                                                  p.location AS parish_location,
                                                  a.email,
                                                  a.user_function,
                                                  a.login
                                           FROM auth a
                                                    JOIN users u ON a.card_id = u.card_id
                                                    JOIN parishes p ON u.id_parish = p.id_parish
                                           WHERE a.card_id = ?`, [cardId]);
        if (result[0] === undefined) {
            return {message: "Błąd pobierania profilu"};
        }
        const [weekResult] = await pool.execute(`SELECT WEEKOFYEAR(NOW()) AS current_week`);

        const currentWeek = weekResult[0].current_week;
        const [dutyRows] = await pool.execute(`SELECT day_of_week, time
                                               FROM lso_schedules
                                               WHERE user_card_id = ? AND week_number = ?
                                               ORDER BY FIELD(day_of_week, 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela')
                                                       , time `, [cardId, currentWeek]);
        return res.json({
            ...result[0],
            duties: dutyRows,
            week_number: currentWeek
        });
    } catch (error) {
        console.error("Błąd pobierania danych o profilu", error);
        return res.status(500).json({message: "Błąd serwera"});
    }
}
async function getRankingData(cardId, res) {
    try {

        const [rows] = await pool.execute(`SELECT id_parish FROM users WHERE card_id = ?`, [cardId]);
        if (!rows[0]) {
            return res.status(403).json({ message: "Brak danych o parafii" });
        }
        const parishID = rows[0].id_parish;

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const tableYear = `${parishID}_${year}`.trim();
        const tableMonth = `${parishID}_${month}_${year}`.trim();

        async function fetchStatsFromTable(tableName) {
            const [rows] = await pool.execute(`
                WITH ranked AS (
                    SELECT
                        card_id,
                        points,
                        points_meating,
                        sum,
                        ROW_NUMBER() OVER (ORDER BY sum DESC) AS position
                    FROM \`${tableName}\`
                )
                SELECT
                    r.card_id,
                    r.points,
                    r.points_meating,
                    r.sum,
                    r.position AS ranking,
                    IFNULL((SELECT sum FROM ranked WHERE position = 1) - r.sum, 0) AS strata_do_lidera,
                    IFNULL(r.sum - (SELECT sum FROM ranked WHERE position = r.position - 1), 0) AS strata_do_poprzedzajacego,
                    IFNULL(r.sum - (SELECT sum FROM ranked WHERE position = r.position + 1), 0) AS przewaga_nad_nastepnym
                FROM ranked r
                WHERE r.card_id = ?
            `, [cardId]);

            if (!rows[0]) {
                return {
                    card_id: cardId,
                    points: 0,
                    points_meating: 0,
                    sum: 0,
                    ranking: 0,
                    strata_do_lidera: 0,
                    strata_do_poprzedzajacego: 0,
                    przewaga_nad_nastepnym: 0
                };
            }

            const r = rows[0];
            return {
                card_id: r.card_id,
                points: r.points ?? 0,
                points_meating: r.points_meating ?? 0,
                sum: r.sum ?? 0,
                ranking: r.ranking ?? 0,
                strata_do_lidera: r.strata_do_lidera ?? 0,
                strata_do_poprzedzajacego: (-r.strata_do_poprzedzajacego) ?? 0,
                przewaga_nad_nastepnym: r.przewaga_nad_nastepnym ?? 0
            };
        }

        const monthStats = await fetchStatsFromTable(tableMonth);
        const yearStats = await fetchStatsFromTable(tableYear);

        return res.status(200).json({
            card_id: cardId,
            parish: parishID,
            month: monthStats,
            year: yearStats
        });

    } catch (error) {
        console.error("Błąd pobierania danych rankingowych", error);
        return res.status(500).json({ message: "Błąd serwera" });
    }
}
async function getHistoryData(cardId,res){
    try{
        const [rows] = await pool.execute(`SELECT id_parish FROM users WHERE card_id = ?`, [cardId]);
        if (!rows[0]) {
            return res.status(403).json({ message: "Brak danych o parafii" });
        }
        const parishID = rows[0].id_parish;
        const [rowsHistory] = await pool.execute(
            `SELECT
    id AS reading_id,
       DATE_FORMAT(date_read, '%d.%m.%Y') AS date,
       DAYNAME(date_read) AS day_en,
       name_service AS name,
       TIME_FORMAT(time_service, '%H:%i') AS time,
       points
     FROM \`${parishID}_readings\`
     WHERE card_id = ?
     ORDER BY date_read DESC, time_service DESC
     LIMIT 10`,
            [cardId]
        );
        if(rowsHistory[0]===undefined){
            return res.status(403).json({message: 'Brak historii do wyświetlenia'});
        }
        const [justifiedRows] = await pool.execute(
            `SELECT reading_id FROM justifications WHERE card_id = ?`,
            [cardId]
        );
        const justifiedIds = new Set(justifiedRows.map((j) => j.reading_id));
        const dayMap = {
            Monday: "Poniedziałek",
            Tuesday: "Wtorek",
            Wednesday: "Środa",
            Thursday: "Czwartek",
            Friday: "Piątek",
            Saturday: "Sobota",
            Sunday: "Niedziela",
        };
        const result = rowsHistory.map((row) => ({
            reading_id: row.reading_id,
            date: row.date,
            day: dayMap[row.day_en] || row.day_en,
            name: row.name,
            time: row.time,
            points: row.points,
            has_justification: justifiedIds.has(row.reading_id)
        }));
        return res.status(200).json(result);
    }catch (error){
        console.error("Błąd pobierania danych hitorii", error);
        return res.status(500).json({ message: "Błąd serwera" });
    }
}
async function sendJustificationText(cardId, readingId, message, res){
    try {

        const [existing] = await pool.execute(
            `SELECT id FROM justifications WHERE card_id = ? AND reading_id = ?`,
            [cardId, readingId]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: "Usprawiedliwienie dla tego odczytu zostało już wysłane.",
            });
        }


        await pool.execute(
            `INSERT INTO justifications (reading_id, card_id, message) VALUES (?, ?, ?)`,
            [readingId, cardId, message]
        );

        return res.status(200).json({ message: "Usprawiedliwienie zostało wysłane." });
    } catch (error) {
        console.error("Błąd podczas zapisu usprawiedliwienia:", error);
        return res.status(500).json({ message: "Błąd serwera przy wysyłaniu usprawiedliwienia." });
    }
}
async function getNotification(cardId,res){
    try {
        // 1. Pobierz id_parish
        const [userRow] = await pool.execute(
            `SELECT id_parish FROM users WHERE card_id = ?`,
            [cardId]
        );
        if (!userRow.length) {
            return res.status(404).json({ message: "Użytkownik nie znaleziony" });
        }
        const parishID = userRow[0].id_parish;

        // 2. Usprawiedliwienia
        const [justRows] = await pool.execute(
            `SELECT j.id,
                    DATE_FORMAT(r.date_read, '%d.%m.%Y') AS date,
         r.name_service AS service,
         j.message,
        CASE 
  WHEN j.status = 'pending' THEN 'Oczekuje'
  WHEN j.status = 'accepted' THEN 'Zaakceptowano'
  WHEN j.status = 'rejected' THEN 'Odrzucono'
  ELSE j.status
            END
            AS status
       FROM justifications j
       JOIN \`${parishID}_readings\` r ON j.reading_id = r.id
       WHERE j.card_id = ? AND j.hidden_for_user = 0
       ORDER BY r.date_read DESC`,
            [cardId]
        );

        const [sentMessages] = await pool.execute(
            `SELECT id, subject, body
   FROM messages
   WHERE sender_id = ? 
     AND is_reply = 0
     AND hidden_for_user = 0
     AND id NOT IN (
        SELECT message_id FROM hidden_messages WHERE card_id = ?
     )
   ORDER BY created_at DESC`,
            [cardId, cardId]
        );

        // 4. Odpowiedzi moderatora do użytkownika
        const [replies] = await pool.execute(
            `SELECT reply_to, body
       FROM messages
       WHERE is_reply = 1 AND recipient_id = ? AND hidden_for_user = 0`,
            [cardId]
        );

        const replyMap = {};
        replies.forEach((r) => {
            replyMap[r.reply_to] = r.body;
        });

        const sentFormatted = sentMessages.map((msg) => ({
            id: msg.id,
            subject: msg.subject,
            body: msg.body,
            reply: replyMap[msg.id] || null,
        }));

        // 5. Wiadomości od moderatora do tego usera lub do wszystkich
        const [modMessages] = await pool.execute(
            `SELECT id, subject, body
             FROM messages
             WHERE sender_id = 'MODERATOR'
               AND is_reply = 0
               AND (recipient_id = ? OR recipient_id IS NULL)
               AND id NOT IN (
                 SELECT message_id FROM hidden_messages WHERE card_id = ?
             )
             ORDER BY created_at DESC`,
            [cardId, cardId]
        );

        const modFormatted = modMessages.map((msg) => ({
            id: msg.id,
            subject: msg.subject,
            body: msg.body,
        }));

        // 6. Zwróć całość
        return res.status(200).json({
            justifications: justRows,
            sentMessages: sentFormatted,
            modMessages: modFormatted,
        });
    } catch (error) {
        console.error("Błąd pobierania powiadomień:", error);
        return res.status(500).json({ message: "Błąd serwera przy pobieraniu powiadomień" });
    }
}
async function deleteNotification(cardId, type, id, res) {
    try {
        switch (type) {
            case "justification": {
                const [result] = await pool.execute(
                    `UPDATE justifications SET hidden_for_user = 1 WHERE id = ? AND card_id = ?`,
                    [id, cardId]
                );
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "Usprawiedliwienie nie znalezione lub brak uprawnień." });
                }
                return res.status(200).json({ message: "Usprawiedliwienie ukryte." });
            }

            case "sent": {
                const [result] = await pool.execute(
                    `UPDATE messages SET hidden_for_user = 1 WHERE id = ? AND sender_id = ? AND is_reply = 0`,
                    [id, cardId]
                );
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "Wiadomość nie znaleziona lub brak uprawnień." });
                }
                return res.status(200).json({ message: "Wiadomość ukryta." });
            }

            case "mod": {
                // sprawdź, czy wiadomość istnieje i czy użytkownik ma do niej dostęp
                const [check] = await pool.execute(
                    `SELECT id FROM messages 
           WHERE id = ? 
           AND sender_id = 'MODERATOR' 
           AND is_reply = 0 
           AND (recipient_id = ? OR recipient_id IS NULL)`,
                    [id, cardId]
                );

                if (check.length === 0) {
                    return res.status(404).json({ message: "Wiadomość nie istnieje lub brak uprawnień." });
                }

                // ukryj wiadomość przez dodanie do tabeli hidden_messages
                await pool.execute(
                    `INSERT IGNORE INTO hidden_messages (card_id, message_id) VALUES (?, ?)`,
                    [cardId, id]
                );

                return res.status(200).json({ message: "Wiadomość ukryta." });
            }

            default:
                return res.status(400).json({ message: "Nieobsługiwany typ powiadomienia." });
        }
    } catch (error) {
        console.error("Błąd podczas ukrywania powiadomienia:", error);
        return res.status(500).json({ message: "Błąd serwera przy ukrywaniu powiadomienia." });
    }
}
async function sendMessage(cardId, subject, message,res){
    try {
        if (!subject || !message) {
            return res.status(400).json({ message: "Temat i treść wiadomości są wymagane." });
        }

        const [result] = await pool.execute(
            `INSERT INTO messages 
        (sender_id, recipient_id, subject, body, is_reply, hidden_for_user, hidden_for_moderator)
       VALUES (?, 'MODERATOR', ?, ?, 0, 0, 0)`,
            [cardId, subject.trim(), message.trim()]
        );

        if (result.affectedRows === 1) {
            return res.status(200).json({ message: "Wiadomość została wysłana." });
        } else {
            return res.status(500).json({ message: "Nie udało się zapisać wiadomości." });
        }
    } catch (error) {
        console.error("Błąd przy zapisie wiadomości:", error);
        return res.status(500).json({ message: "Błąd serwera podczas wysyłania wiadomości." });
    }
}
async function getRankingAll(cardId, res) {
    try {
        // Krok 1: pobierz id_parish
        const [userRows] = await pool.execute(
            `SELECT id_parish FROM users WHERE card_id = ?`,
            [cardId]
        );

        if (userRows[0]===undefined) {
            return res.status(404).json({ message: "Nie znaleziono parafii" });
        }

        const parishID = userRows[0].id_parish;

        // Ustal aktualny miesiąc i rok
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear().toString();

        const monthlyTable = `${parishID}_${month}_${year}`;
        const yearlyTable = `${parishID}_${year}`;

        let monthlyRanking = [];
        let yearlyRanking = [];

        // Krok 2: Ranking miesięczny
        try {
            const [monthlyRows] = await pool.execute(
                `SELECT u.first_name, u.last_name, r.card_id, r.points, r.points_meating, r.sum
         FROM \`${monthlyTable}\` r
         JOIN users u ON u.card_id = r.card_id
         ORDER BY r.sum DESC`
            );

            monthlyRanking = monthlyRows.map((row) => ({
                name: `${row.first_name} ${row.last_name}`,
                card_id: row.card_id,
                service: row.points,
                meetings: row.points_meating,
                total: row.sum,
            }));
        } catch (err) {
            console.warn(`Brak tabeli miesięcznej: ${monthlyTable}`);
        }

        // Krok 3: Ranking roczny
        try {
            const [yearlyRows] = await pool.execute(
                `SELECT u.first_name, u.last_name, r.card_id, r.points, r.points_meating, r.sum
         FROM \`${yearlyTable}\` r
         JOIN users u ON u.card_id = r.card_id
         ORDER BY r.sum DESC`
            );

            yearlyRanking = yearlyRows.map((row) => ({
                name: `${row.first_name} ${row.last_name}`,
                card_id: row.card_id,
                service: row.points,
                meetings: row.points_meating,
                total: row.sum,
            }));
        } catch (err) {
            console.warn(`Brak tabeli rocznej: ${yearlyTable}`);
        }

        return res.status(200).json({
            current_month: month,
            current_year: year,
            monthlyRanking,
            yearlyRanking,
        });
    } catch (error) {
        console.error("Błąd w getModeratorInitialRanking:", error);
        return res.status(500).json({ message: "Błąd serwera" });
    }
}
async function getRankingMonth(cardId,month,year,res){
    try {

        // Pobierz parish_id
        const [userRow] = await pool.execute(
            `SELECT id_parish FROM users WHERE card_id = ?`,
            [cardId]
        );

        if (userRow[0]===undefined) {
            return res.status(404).json({ message: "Nie znaleziono parafii" });
        }


        const parishID = userRow[0].id_parish;
        const tableName = `${parishID}_${month}_${year}`;
        // Sprawdź, czy tabela istnieje
        const [tableExists] = await pool.execute(
            `SELECT COUNT(*) AS count FROM information_schema.tables 
       WHERE table_schema = DATABASE() AND table_name = ?`,
            [tableName]
        );
        if (tableExists[0].count === 0) {
            return res.status(200).json({ monthlyRanking: [] }); // brak danych
        }

        // Pobierz dane z tabeli rankingowej
        const [rankingRows] = await pool.execute(
            `SELECT u.first_name, u.last_name, r.card_id, r.points, r.points_meating, r.sum
             FROM \`${tableName}\` r
                      JOIN users u ON r.card_id = u.card_id
             ORDER BY r.sum DESC, r.points DESC, r.points_meating DESC`
        );
        const formattedRanking = rankingRows.map(row => ({
            name: `${row.first_name} ${row.last_name}`,
            card_id: row.card_id,
            service: row.points,
            meetings: row.points_meating,
            total: row.sum,
        }));
        return res.status(200).json({ monthlyRanking: formattedRanking });

    } catch (error) {
        console.error("Błąd pobierania rankingu miesięcznego:", error);
        return res.status(500).json({ message: "Błąd serwera" });
    }
}
async function getRankingYear(cardId,year, res){
    try {
        // Pobierz parish_id
        const [userRow] = await pool.execute(
            `SELECT id_parish FROM users WHERE card_id = ?`,
            [cardId]
        );

        if (userRow[0]===undefined) {
            return res.status(404).json({ message: "Nie znaleziono parafii" });
        }


        const parishID = userRow[0].id_parish;
        const tableName = `${parishID}_${year}`;
        // Sprawdź, czy tabela istnieje
        const [tableExists] = await pool.execute(
            `SELECT COUNT(*) AS count FROM information_schema.tables 
       WHERE table_schema = DATABASE() AND table_name = ?`,
            [tableName]
        );
        if (tableExists[0].count === 0) {
            return res.status(200).json({ yearlyRanking: [] }); // brak danych
        }

        // Pobierz dane z tabeli
        const [rankingRows] = await pool.execute(
            `SELECT u.first_name, u.last_name, r.card_id, r.points, r.points_meating, r.sum
             FROM \`${tableName}\` r
                      JOIN users u ON r.card_id = u.card_id
             ORDER BY r.sum DESC, r.points DESC, r.points_meating DESC`);
        const formattedRanking = rankingRows.map(row => ({
            name: `${row.first_name} ${row.last_name}`,
            card_id: row.card_id,
            service: row.points,
            meetings: row.points_meating,
            total: row.sum,
        }));
        return res.status(200).json({ yearlyRanking: formattedRanking });

    } catch (error) {
        console.error("Błąd pobierania rankingu rocznego:", error);
        return res.status(500).json({ message: "Błąd serwera" });
    }
}
async function getRecentReadings(cardId,res){
    try {
        // Pobierz parish_id
        const [userRow] = await pool.execute(
            `SELECT id_parish FROM users WHERE card_id = ?`,
            [cardId]
        );

        if (userRow[0]===undefined) {
            return res.status(404).json({ message: "Nie znaleziono parafii" });
        }


        const parishID = userRow[0].id_parish;
        const tableName = `\`${parishID}_readings\``;

        const [rows] = await pool.execute(
            `SELECT 
          DATE_FORMAT(date_read, '%d.%m.%Y') AS date,
          TIME_FORMAT(time_read, '%H:%i') AS hour,
          name_service AS service_name,
          points
       FROM ${tableName}
       WHERE card_id = ?
       ORDER BY date_read DESC, time_read DESC
       LIMIT 5`,
            [cardId]
        );

        return res.status(200).json({ readings: rows });
    } catch (error) {
        console.error("Błąd podczas pobierania odczytów:", error);
        return res.status(500).json({ message: "Błąd serwera przy pobieraniu odczytów." });
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
    verificationCode,
    newPassword,
    registerDeviceToken,
    logout,
    refreshTokenF,
    getProfilData,
    getRankingData,
    getHistoryData,
    sendJustificationText,
    getNotification,
    deleteNotification,
    sendMessage,
    getRankingAll,
    getRankingYear,
    getRankingMonth,
    getRecentReadings,
};

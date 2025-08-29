const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generateReportFile(rankingData, type, month, year) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const fileName =
                type === "monthly"
                    ? `ranking_miesieczny_${month}_${year}.pdf`
                    : `ranking_roczny_${year}.pdf`;
            const fontPath = path.join(__dirname, "assets/fonts/Roboto-Regular.ttf");

            const writeStream = fs.createWriteStream(fileName);
            doc.pipe(writeStream);

            doc.registerFont("Roboto", fontPath);
            doc.font("Roboto");

            const title =
                type === "monthly"
                    ? `Ranking Miesięczny - ${month}/${year}`
                    : `Ranking Roczny - ${year}`;

            doc.fontSize(20).text(title, { align: "center" }).moveDown(1);

            // 📌 Ustal pozycje kolumn
            const xLp = 50;
            const xName = 100;
            const xService = 300;
            const xMeetings = 370;
            const xTotal = 440;

            // 🧾 Nagłówki
            doc.fontSize(14).font("Roboto");

            const headerY = doc.y; // Zapamiętaj wspólne Y

            doc.text("Lp.", xLp, headerY);
            doc.text("Imię i nazwisko", xName, headerY);
            doc.text("Służba", xService, headerY);
            doc.text("Zbiórki", xMeetings, headerY);
            doc.text("Suma", xTotal, headerY);

            doc.moveDown(1); // Odstęp po nagłówkach

            // 📊 Dane
            rankingData.forEach((item, index) => {
                const y = doc.y;

                // 🏅 Kolor tła wiersza dla top 3
                let fillColor = null;
                if (index === 0) fillColor = '#FFD700';     // złoto
                else if (index === 1) fillColor = '#C0C0C0'; // srebro
                else if (index === 2) fillColor = '#CD7F32'; // brąz

                if (fillColor) {
                    doc.rect(45, y - 2, 500, 18).fill(fillColor).fillColor("black");
                }

                // 🔴 Kolor czcionki, jeśli suma < 0
                const textColor = item.total < 0 ? '#FF0000' : 'black';
                doc.fillColor(textColor).fontSize(12);

                doc.text(`${index + 1}.`, 50, y);
                doc.text(item.name, 100, y);
                doc.text(item.service, 300, y);
                doc.text(item.meetings, 370, y);
                doc.text(item.total, 440, y);

                doc.fillColor("black"); // Przywróć domyślny kolor
                doc.moveDown(0.5);
            });


            doc.end();

            writeStream.on("finish", () => {
                console.log(`✅ PDF zapisany jako ${fileName}`);
                resolve(fileName);
            });

            writeStream.on("error", (err) => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = { generateReportFile };

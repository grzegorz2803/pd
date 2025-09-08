const PDFDocument = require("pdfkit");
const path = require("path");

async function generateReportFile(rankingData, type, month, year) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 40, size: "A4" });
            const chunks = [];


            const fontPath = path.join(__dirname, "assets/fonts/Roboto-Regular.ttf");
            doc.registerFont("Roboto", fontPath);
            doc.font("Roboto");


            doc.on("data", chunk => chunks.push(chunk));
            doc.on("end", () => {
                const buffer = Buffer.concat(chunks);
                const filename = `report-${type==="yearly"?"":month}-${year}.pdf`;
                resolve({ buffer, filename });
            });


            const title = `Ranking ${type === "yearly" ? "Roczny" : "Miesięczny"} - ${year}${type === "monthly" ? ` / ${month}` : ""}`;
            doc.fontSize(20).text(title, { align: "center" });
            doc.moveDown();


            const xLp = 50, xName = 100, xService = 300, xMeetings = 370, xTotal = 440;

            doc.fontSize(14).font("Roboto");
            const headerY = doc.y;
            doc.text("Lp.", xLp, headerY);
            doc.text("Imię i nazwisko", xName, headerY);
            doc.text("Służba", xService, headerY);
            doc.text("Zbiórki", xMeetings, headerY);
            doc.text("Suma", xTotal, headerY);
            doc.moveDown(1);


            rankingData.forEach((item, index) => {
                const y = doc.y;


                let fillColor = null;
                if (index === 0) fillColor = '#FFD700';
                else if (index === 1) fillColor = '#C0C0C0';
                else if (index === 2) fillColor = '#CD7F32';

                if (fillColor) {
                    doc.rect(45, y - 2, 500, 18).fill(fillColor).fillColor("black");
                }

                const textColor = item.total < 0 ? '#FF0000' : 'black';
                doc.fillColor(textColor).fontSize(12);

                doc.text(`${index + 1}.`, xLp, y);
                doc.text(item.name, xName, y);
                doc.text(item.service, xService, y);
                doc.text(item.meetings, xMeetings, y);
                doc.text(item.total, xTotal, y);

                doc.fillColor("black");
                doc.moveDown(0.5);
            });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    generateReportFile,
};

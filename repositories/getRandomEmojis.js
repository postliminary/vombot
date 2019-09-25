const Request = require('tedious').Request;
const SqlTypes = require('tedious').TYPES;
const log = require('../utils/log').logger;
const getConnection = require('./getConnection');

module.exports = async function getRandomEmojis(category, limit = 5) {
    log('Retrieving random emojis', category, limit);

    const connection = await getConnection();
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT TOP ${limit}
                Code, 
                Category
            FROM Emoji 
            WHERE @Category IS NULL OR Category = @Category
            ORDER BY NEWID()
        `;
        const finish = (error, rowCount, rows) => {
            if (error) {
                reject(error);
            } else {
                const emojis = rows.map(r => ({
                    code: r[0].value,
                    category: r[1].value,
                }));
                log('Retrieved emojis', emojis);
                resolve(emojis);
            }
            connection.close();
        };

        const request = new Request(sql, finish);
        request.addParameter('Category', SqlTypes.VarChar, category);

        connection.execSql(request);
    });
};

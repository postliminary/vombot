const Request = require('tedious').Request;
const SqlTypes = require('tedious').TYPES;
const log = require('../utils/log').logger;
const getConnection = require('./getConnection');

const TempTableName = '#BulkEmojis';

module.exports = async function(emojis) {
    log('Bulk uploading emojis');

    const connection = await getConnection();

    log('Create temp table');
    await createTempTable(connection);

    log('Upload emojis');
    await bulkUpload(emojis, connection);

    log('Merge emojis');
    await mergeEmojis(connection);
};

async function createTempTable(connection) {
    return new Promise((resolve, reject) =>  {
        const sql = `
            CREATE TABLE ${TempTableName}(
                Code VARCHAR(256),
                Category VARCHAR(256)
            )
        `;
        const finish = error => {
            if (error) {
                reject(error);
                connection.close();
            } else {
                resolve();
            }
        };

        const request = new Request(sql, finish);
        connection.execSqlBatch(request);
    });
}

async function bulkUpload(emojis, connection) {
    return new Promise((resolve, reject) => {
        const finish = error => {
            if (error) {
                reject(error);
                connection.close();
            } else {
                resolve();
            }
        };

        const bulkLoad = connection.newBulkLoad(TempTableName, {}, finish);

        bulkLoad.addColumn('Code', SqlTypes.VarChar, { length: 256 });
        bulkLoad.addColumn('Category', SqlTypes.VarChar, { length: 256 });

        emojis.forEach(emoji => bulkLoad.addRow({ Code: emoji.code, Category: emoji.category }));

        connection.execBulkLoad(bulkLoad);
    });
}

async function mergeEmojis(connection) {
    return new Promise((resolve, reject) =>  {
        const sql = `
            INSERT INTO Emoji(
                Code, 
                Category
            ) 
            SELECT 
               t.Code, 
               t.Category
            FROM ${TempTableName} t
            LEFT JOIN Emoji e ON t.Code = e.Code AND t.Category = e.Category
            WHERE e.Code IS NULL

            DELETE e 
            FROM Emoji e
            LEFT JOIN ${TempTableName} t ON t.Code = e.Code AND t.Category = e.Category
            WHERE t.Code IS NULL
        `;
        const finish = error => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
            connection.close();
        };

        const request = new Request(sql, finish);
        connection.execSqlBatch(request);
    });
}

const Connection = require('tedious').Connection;
const log = require('../utils/log').logger;

module.exports = function() {
    return new Promise((resolve, reject) => {
        const config = {
            server: process.env['VOMBOT_SQL_SERVER'],
            authentication: {
                type: 'default',
                options: {
                    userName: process.env['VOMBOT_SQL_USER'],
                    password: process.env['VOMBOT_SQL_PASSWORD'],
                },
            },
            options: {
                port: parseInt(process.env['VOMBOT_SQL_PORT'], 10),
                database: process.env['VOMBOT_SQL_DATABASE'],
                encrypt: true,
                connectTimeout: 30000,
                rowCollectionOnRequestCompletion: true,
            },
        };

        const connection = new Connection(config);
        connection.on('connect', function(error) {
            if (error) {
                log('Error connecting', error);
                reject(error);
            }
            else {
                log(`Connected to ${config.server}`);
                resolve(connection);
            }
        });
    });
};

const mysql = require('mysql2/promise');
const fs = require('fs');

const WebConfigData = fs.readFileSync('webconfig.json');
const WebConfig = JSON.parse(WebConfigData);

const pool = mysql.createPool({
	host: WebConfig.database.host,
	user: WebConfig.database.user,
	password: WebConfig.database.password,
	database: WebConfig.database.database,
	waitForConnections: true,
	connectionLimit: WebConfig.database.connLimit,
	queueLimit: WebConfig.database.queueLimit
});
  
module.exports = pool;
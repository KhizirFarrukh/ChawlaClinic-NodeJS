const mysql = require('mysql');
const fs = require('fs');

const WebConfigData = fs.readFileSync('webconfig.json');
const WebConfig = JSON.parse(WebConfigData);

const con = mysql.createConnection({
    host: WebConfig.database.host,
    user: WebConfig.database.user,
    password: WebConfig.database.password
});
con.connect(function(err) {
    if(err) throw err;
    console.log("connected to mysql database");
});
const sql = "use " + WebConfig.database.database + ";";
con.query(sql, function (err, result) {
    if (err) throw err;
});
module.exports = con;
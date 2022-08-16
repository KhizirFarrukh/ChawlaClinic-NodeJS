const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root"
});
con.connect(function(err) {
    if(err) throw err;
    console.log("connected to mysql database");
});
const sql = "use chawlaclinic;";
con.query(sql, function (err, result) {
    if (err) throw err;
});
module.exports = con;
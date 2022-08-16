const mysql = require('mysql');
function ExecuteQuery(data, GetTokenInfo, con, callback) {
  GetTokenInfo.ExecuteQuery(data.Type, con,  function (MaxTokenValue) {
    var NewTokenNumber = parseInt(MaxTokenValue) + 1;
    const currentDateTime = new Date(data.TokenDateTime);
    var TokenDateTime = currentDateTime.getFullYear() + "-" + String(currentDateTime.getMonth() + 1).padStart(2, '0') + "-" + String(currentDateTime.getDate()).padStart(2, '0') + " " + String(currentDateTime.getHours()).padStart(2, '0') + ":" + String(currentDateTime.getMinutes()).padStart(2, '0') + ":" + String(currentDateTime.getSeconds()).padStart(2, '0');
    console.log(TokenDateTime);
    var sql = "INSERT INTO patienttokennumbers(`TokenNumber`, `PatientGender`, `PatientName`, `TokenDateTime`) ";
    sql += "VALUES(" + NewTokenNumber + ",'" + data.Type + "','" + data.Name + "','" + TokenDateTime + "');";
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        callback();
    });
	});
}
module.exports = { ExecuteQuery };
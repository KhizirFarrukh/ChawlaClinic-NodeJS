const mysql = require('mysql');
function ExecuteQuery(data, GetTokenInfo, con, callback) {
  GetTokenInfo.ExecuteQuery(data.Type, con,  function (MaxTokenValue) {
    var NewTokenNumber = parseInt(MaxTokenValue) + 1;
    const currentDateTime = new Date(data.TokenDateTime);
    var TokenDateTime = currentDateTime.getFullYear() + "-" + String(currentDateTime.getMonth() + 1).padStart(2, '0') + "-" + String(currentDateTime.getDate()).padStart(2, '0') + " " + String(currentDateTime.getHours()).padStart(2, '0') + ":" + String(currentDateTime.getMinutes()).padStart(2, '0') + ":" + String(currentDateTime.getSeconds()).padStart(2, '0');
    console.log(TokenDateTime);
    var sql_Record = "INSERT INTO patienttokennumbers(`TokenNumber`, `TokenType`, `PatientName`, `TokenDateTime`) ";
    sql_Record += "VALUES(" + NewTokenNumber + ",'" + data.Type + "','" + data.Name + "','" + TokenDateTime + "');";
    console.log(sql_Record);
    con.query(sql_Record, function (err, result) {
        if (err) throw err;
        var sql_Logs = "INSERT INTO patienttokenlogs(`TokenNumber`, `TokenType`, `PatientName`, `TokenDateTime`) ";
        sql_Logs += "VALUES(" + NewTokenNumber + ",'" + data.Type + "','" + data.Name + "','" + TokenDateTime + "');";
        con.query(sql_Logs, function (err, result) {
          if (err) throw err;
          callback(NewTokenNumber);
      });
    });
	});
}
module.exports = { ExecuteQuery };
const mysql = require('mysql');
function ExecuteQuery(data, PatientID, SQL_GetPadPricing, con, callback) {
  SQL_GetPadPricing.ExecuteQuery(data.padquantity, data.padfraction, con, function(PadPrice){
    var padQty = parseFloat(data.padquantity) + parseFloat(eval(data.padfraction));
    var tempdressing_sql = "INSERT INTO patientdressingtemphold(`PatientID`,`DressingDate`,`QtyOfPads`,`TotalAmount`) ";
    tempdressing_sql += "VALUES(" + PatientID + ",STR_TO_DATE('" + data.dressingdate + "','%Y-%m-%d')," + padQty + "," + PadPrice + ");";
    console.log(tempdressing_sql);
    con.query(tempdressing_sql, function (err) {
      if (err) throw err;
      callback();
    });
  });
}
module.exports = { ExecuteQuery };
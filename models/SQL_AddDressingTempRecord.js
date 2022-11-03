const mysql = require('mysql');
function ExecuteQuery(data, getTempDressing, con, callback) {
    if(data.discountamount == undefined) {
        data.discountamount = 0;
    }
    getTempDressing.ExecuteQuery(data.dressing_pid, con, function (getResult) {
			console.log(getResult);
      if(getResult.length == 0) {
        var padQty = parseFloat(data.padquantity) + parseFloat(eval(data.padfraction));
        var tempdressing_sql = "INSERT INTO patientdressingtemphold(`PatientID`,`DressingDate`,`QtyOfPads`,`AmountPaid`,`TotalAmount`,`AmountReduction`,`DiscountOption`) ";
        tempdressing_sql += "VALUES(" + data.dressing_pid + ",STR_TO_DATE('" + data.dressingdate + "','%Y-%m-%d')," + padQty + "," + data.amountpaid + "," + data.totalamount + "," + data.discountamount + ",(SELECT DiscountMode FROM patientdetails where PatientID = " + data.dressing_pid + "));";
        console.log(tempdressing_sql);
        con.query(tempdressing_sql, function (err, result) {
          if (err) throw err;
          callback("true");
        });
      } else {
        callback("false");
      }
    });
    
}
module.exports = { ExecuteQuery };
const mysql = require('mysql');
function ExecuteQuery(MaxCount, con, callback) {
  var TokenMaxCounts = {Male:0,Female:0,Child:0};
  var MaleDetails;
  var FemaleDetails;
  var ChildDetails;

  var sql_MaxMaleCount = "SELECT max(TokenNumber) AS \"MaleMax\" FROM patienttokennumbers WHERE TokenType = 'Male';";
  var sql_MaxFemaleCount = "SELECT max(TokenNumber) AS \"FemaleMax\" FROM patienttokennumbers WHERE TokenType = 'Female';";
  var sql_MaxChildCount = "SELECT max(TokenNumber) AS \"ChildMax\" FROM patienttokennumbers WHERE TokenType = 'Child';";
  var sql_MaleDetails = "SELECT TokenNumber,PatientName from patienttokennumbers WHERE TokenType = 'Male';";
  var sql_FemaleDetails = "SELECT TokenNumber,PatientName from patienttokennumbers WHERE TokenType = 'Female';";
  var sql_ChildDetails = "SELECT TokenNumber,PatientName from patienttokennumbers WHERE TokenType = 'Child';";
  con.query(sql_MaxMaleCount, function (err, result) {
    if (err) throw err;
    if(result[0].MaleMax != null) {
      TokenMaxCounts.Male = result[0].MaleMax;
    }
    if(MaxCount == "Male") {
      callback(TokenMaxCounts.Male);
    } else {
      con.query(sql_MaxFemaleCount, function (err, result) {
        if (err) throw err;
        if(result[0].FemaleMax != null) {
          TokenMaxCounts.Female = result[0].FemaleMax;
        }
        if(MaxCount == "Female") {
          callback(TokenMaxCounts.Female);
        } else {
          con.query(sql_MaxChildCount, function (err, result) {
            if (err) throw err;
            if(result[0].ChildMax != null) {
              TokenMaxCounts.Child = result[0].ChildMax;
            }
            if(MaxCount == "Child") {
              callback(TokenMaxCounts.Child);
            } else {
              con.query(sql_MaleDetails, function (err, result) {
                if (err) throw err;
                MaleDetails = result;
                con.query(sql_FemaleDetails, function (err, result) {
                  if (err) throw err;
                  FemaleDetails = result;
                  con.query(sql_ChildDetails, function (err, result) {
                    if (err) throw err;
                    ChildDetails = result;
                    callback(TokenMaxCounts,MaleDetails,FemaleDetails,ChildDetails);
                  });
                });
              });
            }
          });
        }
      });
    }
  });
}
module.exports = { ExecuteQuery };
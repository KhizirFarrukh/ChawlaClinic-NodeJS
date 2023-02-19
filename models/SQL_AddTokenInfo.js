function ExecuteQuery(TokenPatientID, TokenName, TokenType, TokenDateTime, GetTokenInfo, SearchPatient, con, callback) {
  if(TokenPatientID === undefined) { 
    TokenPatientID = "NULL";
    GetTokenInfo.ExecuteQuery(TokenType, con, function (MaxTokenValue) {
      console.log(MaxTokenValue);
      var NewTokenNumber = parseInt(MaxTokenValue) + 1;
      console.log(TokenDateTime);
      var sql_Record = "INSERT INTO patienttokennumbers(`TokenNumber`, `TokenType`, `PatientID`, `PatientName`, `TokenDateTime`) ";
      sql_Record += "VALUES(" + NewTokenNumber + ",'" + TokenType + "'," + TokenPatientID + ",'" + TokenName + "','" + TokenDateTime + "');";
      console.log(sql_Record);
      con.query(sql_Record, function (err, result) {
        if (err) throw err;
        const TokenID = result.insertId;
        var sql_Logs = "INSERT INTO patienttokenlogs(`TokenNumber`, `TokenType`, `PatientID`, `PatientName`, `TokenDateTime`) ";
        sql_Logs += "VALUES(" + NewTokenNumber + ",'" + TokenType + "'," + TokenPatientID + ",'" + TokenName + "','" + TokenDateTime + "');";
        con.query(sql_Logs, function (err) {
          if (err) throw err;
          callback(NewTokenNumber, TokenType, undefined, TokenID);
        });
      });
    });
  }
  else {
    SearchPatient.ExecuteQuery("PatientID",TokenPatientID,"token",con,function(patientDetails) {
      TokenName = patientDetails[0].PatientName;
      const PatientAge = patientDetails[0].Age;
      const PatientGender = patientDetails[0].Gender;
      if(PatientAge < 12) {
        TokenType = "Child";
      } else {
        if(PatientGender === "M") {
          TokenType = "Male";
        } else if(PatientGender === "F") {
          TokenType = "Female";
        }
      }
      GetTokenInfo.ExecuteQuery(TokenType, con, function (MaxTokenValue) {
        console.log(MaxTokenValue);
        var NewTokenNumber = parseInt(MaxTokenValue) + 1;
        console.log(TokenDateTime);
        var sql_Record = "INSERT INTO patienttokennumbers(`TokenNumber`, `TokenType`, `PatientID`, `PatientName`, `TokenDateTime`) ";
        sql_Record += "VALUES(" + NewTokenNumber + ",'" + TokenType + "'," + TokenPatientID + ",'" + TokenName + "','" + TokenDateTime + "');";
        console.log(sql_Record);
        con.query(sql_Record, function (err, result) {
          if (err) throw err;
          const TokenID = result.insertId;
          var sql_Logs = "INSERT INTO patienttokenlogs(`TokenNumber`, `TokenType`, `PatientID`, `PatientName`, `TokenDateTime`) ";
          sql_Logs += "VALUES(" + NewTokenNumber + ",'" + TokenType + "'," + TokenPatientID + ",'" + TokenName + "','" + TokenDateTime + "');";
          con.query(sql_Logs, function (err) {
            if (err) throw err;
            callback(NewTokenNumber, TokenType, TokenPatientID, TokenID);
          });
        });
      });
    });
  }
}
module.exports = { ExecuteQuery };
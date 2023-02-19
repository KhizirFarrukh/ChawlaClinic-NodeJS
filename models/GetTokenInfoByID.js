function ExecuteQuery(TokenID, con, callback) {
  const Token_sql = "SELECT patient.CaseNo, token.TokenNumber, token.TokenType, token.TokenDateTime FROM patienttokennumbers token LEFT JOIN patientdetails patient ON token.PatientID = patient.PatientID WHERE token.TokenID = " + TokenID;
  console.log(Token_sql);
  con.query(Token_sql, function (err, result) {
      if (err) throw err;
      console.log("Token Info by ID: ", result)
      callback(result);
  });
}
module.exports = { ExecuteQuery };
function ExecuteQuery(searchOption, searchKeyword, searchMode, con, callback) {
    var sql = "SELECT * FROM patientdetails WHERE ";
    if(searchOption === "CaseNo") {
        searchKeyword = searchKeyword.toLowerCase();
        sql += "LOWER(CaseNo) LIKE '%" + searchKeyword + "%'";
    } else if(searchOption === "MobileNum") {
        sql += "PhoneNumber = '" + searchKeyword + "'";
    } else if(searchOption === "Name") {
        searchKeyword = searchKeyword.toLowerCase();
        sql += "LOWER(PatientName) LIKE '%" + searchKeyword + "%'";
    } else if(searchOption === "PatientID") {
        sql += "PatientID = " + searchKeyword;
    }
    if(searchMode === "token") {
        sql += " AND PatientID NOT IN (SELECT PatientID FROM patienttokennumbers WHERE PatientID IS NOT NULL)"
    }
    sql += " ORDER BY FirstVisit DESC LIMIT 10;";
    console.log(sql)
    con.query(sql, function (err, result) {
        if (err) throw err;
        callback(result);
    });
}
module.exports = { ExecuteQuery };
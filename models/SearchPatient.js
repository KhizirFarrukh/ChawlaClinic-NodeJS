function ExecuteQuery(table, attrib, val, con, callback) {
    var sql = "SELECT * FROM " + table + " WHERE ";
    if(attrib == "CaseNo") {
        val = val.toLowerCase();
        sql += "LOWER(CaseNo) LIKE '%" + val + "%'";
    } else if(attrib == "MobileNum") {
        sql += "PhoneNumber = '" + val + "'";
    } else if(attrib == "Name") {
        val = val.toLowerCase();
        sql += "LOWER(PatientName) LIKE '%" + val + "%'";
    } else if(attrib == "PatientID") {
        sql += "PatientID = " + val;
    }
    sql += " ORDER BY FirstVisit DESC LIMIT 10;";
    console.log(sql)
    con.query(sql, function (err, result) {
        if (err) throw err;
        callback(result);
    });
}
module.exports = { ExecuteQuery };
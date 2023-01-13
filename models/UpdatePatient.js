const mysql = require('mysql');
function ExecuteQuery(id, data, con, callback) {
    var SearchSQL = "SELECT * FROM patientdetails where PatientID = " + id;
    con.query(SearchSQL, function (err, result) {
        if (err) throw err;
        console.log(result);
        var Age = parseFloat(data.ageyears) + parseFloat(data.agemonths/12);
        Age = parseFloat(Age).toFixed(3);
        console.log(Age);
        var sql = "UPDATE patientdetails SET PatientName = '" + data.patientname + "', ";
        sql += "Age = " + Age + ", Gender = '" + data.gender + "', ";
        sql += "GuardianName = '" + data.guardianname + "', Type = '" + data.type + "', ";
        sql += "Disease = '" + data.disease + "', Address = '" + data.address + "', ";
        sql += "Status = '" + data.status + "', PhoneNumber = '" + data.phonenum + "', ";
        sql += "FirstVisit = STR_TO_DATE('" + data.firstvisit + "','%Y-%m-%d'), ";
        sql += "DiscountMode = '" + data.discountmode + "' WHERE PatientID = " + id;
        console.log(sql)
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    });
    
}
module.exports = { ExecuteQuery };
const mysql = require('mysql');

function ExecuteQuery(data, con, callback) {
    // validation check on value for sql injection
    // change from select all to select specific attributes
    var sql = "INSERT INTO patientdetails(`CaseNo`,`Type`,`PatientName`,`Age`,`Gender`,`GuardianName`,`Disease`,`Address`,`PhoneNumber`,`FirstVisit`,`AddedBy`)";
    // var CaseNo = data.caseno;
    var Type = data.type;
    var PatientName = data.patientname;
    console.log(data.ageyears);
    console.log(data.agemonths);
    var Age = parseFloat(data.ageyears) + parseFloat(data.agemonths/12);
    Age = parseFloat(Age).toFixed(3);
    console.log(Age);
    var Gender = data.gender;
    var GuardianName = data.guardianname;
    var Disease = data.disease;
    var Address = data.address;
    var PhoneNumber = data.phonenum;
    var FirstVisit = data.firstvisit;
    var AddedBy = "ADMIN"; //Change when account management is implemented
    
    var NewCaseNo = "";
    var CaseNoFetchParam = String((new Date(data.firstvisit)).getFullYear()%100) + data.type + "-";
    console.log(CaseNoFetchParam);
    NewCaseNo += CaseNoFetchParam;
    if(data.caseno != undefined) {
        var sql1 = "SELECT count(`CaseNo`) AS \"CaseCount\" FROM patientdetails WHERE `CaseNo` LIKE '" + CaseNoFetchParam + "%" + data.caseno + "';";
        console.log(sql1);
        con.query(sql1, function (err, result, fields) {
            if (err) throw err;
            console.log(result[0].CaseCount);
            NewCaseNo += String(parseInt(result[0].CaseCount)).padStart(2,'0') + data.caseno;
            console.log(NewCaseNo);
            sql += " VALUES('" + NewCaseNo + "','" + Type + "','" + PatientName + "'," + Age + ",'" + Gender + "','" + GuardianName + "','" + Disease + "','" + Address;
            sql += "','" + PhoneNumber + "',STR_TO_DATE('" + FirstVisit + "','%Y-%m-%d'),'" + AddedBy + "');";
            console.log(sql);
            con.query(sql, function (err, result, fields) {
                if (err) throw err;
                callback(result);
            });
        });
    } else {
        var sql1 = "SELECT MAX(`CaseNo`) AS \"CaseMax\" FROM patientdetails WHERE `CaseNo` LIKE '" + CaseNoFetchParam + "%';";
        console.log(sql1);
        con.query(sql1, function (err, result, fields) {
            if (err) throw err;
            console.log(result[0].CaseMax);
            if(result[0].CaseMax == null) {
                NewCaseNo += String(1).padStart(6,'0');
                console.log(NewCaseNo);
                sql += " VALUES('" + NewCaseNo + "','" + Type + "','" + PatientName + "'," + Age + ",'" + Gender + "','" + GuardianName + "','" + Disease + "','" + Address;
                sql += "','" + PhoneNumber + "',STR_TO_DATE('" + FirstVisit + "','%Y-%m-%d'),'" + AddedBy + "');";
                console.log(sql);
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    callback(result);
                });
            } else {
                NewCaseNo += String(parseInt((result[0].CaseMax).slice(4,10)) + 1).padStart(6,'0');
                console.log(NewCaseNo);
                sql += " VALUES('" + NewCaseNo + "','" + Type + "','" + PatientName + "'," + Age + ",'" + Gender + "','" + GuardianName + "','" + Disease + "','" + Address;
                sql += "','" + PhoneNumber + "',STR_TO_DATE('" + FirstVisit + "','%Y-%m-%d'),'" + AddedBy + "');";
                console.log(sql);
                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    callback(result);
                });
            }
        });
    }
}
module.exports = { ExecuteQuery };
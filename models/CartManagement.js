function ExecuteQuery(prodID, patientID, Quantity, con, callback) {
    var searchSQL = "SELECT * FROM patientproductscart WHERE ProductID = " + prodID + " AND PatientID = " + patientID + ";";
    console.log(searchSQL);
    con.query(searchSQL, function (err, searchresult) {
        console.log(searchresult);
        if (err) throw err;
        if(searchresult.length == 0) {
            if(Quantity == 1) {
                var insertSQL = "INSERT INTO patientproductscart(`ProductID`,`PatientID`,`Quantity`) VALUES(" + prodID + "," + patientID + "," + 1 + ");";
                console.log(insertSQL);
                con.query(insertSQL, function (err, result) {
                    if (err) throw err;
                    callback(result);
                });
            }
        } else if (searchresult.length > 0) {
            if(Quantity == 1) {
                var updateSQL = "UPDATE patientproductscart SET Quantity = Quantity + 1 WHERE ProductID = " + prodID + " AND PatientID = " + patientID + ";";
                console.log(updateSQL);
                con.query(updateSQL, function (err, result) {
                    if (err) throw err;
                    callback(result);
                });
            } else if (Quantity == -1) {
                if(searchresult[0].Quantity == 1) {
                    var deleteSQL = "DELETE FROM patientproductscart WHERE ProductID = " + prodID + " AND PatientID = " + patientID + ";";
                    console.log(deleteSQL);
                    con.query(deleteSQL, function (err, result) {
                        if (err) throw err;
                        callback(result);
                    });
                } else {
                    var updateSQL = "UPDATE patientproductscart SET Quantity = Quantity - 1 WHERE ProductID = " + prodID + " AND PatientID = " + patientID + ";";
                    console.log(updateSQL);
                    con.query(updateSQL, function (err, result) {
                        if (err) throw err;
                        callback(result);
                    });
                }
            }
        }
    });
}
module.exports = { ExecuteQuery };
const mysql = require('mysql');
function ExecuteQuery(con, callback) {
    var sql = "SELECT * FROM `productcategory` WHERE CategoryName != 'Dressing Pad';"; // add not condition for general medicines when they are added
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        callback(result);
    });
}
module.exports = { ExecuteQuery };
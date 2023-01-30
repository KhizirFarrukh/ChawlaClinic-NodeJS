function ExecuteQuery(con, callback) {
    var sql = "SELECT * FROM `productcategory` WHERE CategoryName != 'Dressing Pad';";
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        callback(result);
    });
}
module.exports = { ExecuteQuery };
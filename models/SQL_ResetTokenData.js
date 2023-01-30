function ExecuteQuery(con, callback) {
  var sql = "DELETE FROM patienttokennumbers;";
  console.log(sql);
  con.query(sql, function (err, result) {
      if (err) throw err;
      callback();
  });
}
module.exports = { ExecuteQuery };
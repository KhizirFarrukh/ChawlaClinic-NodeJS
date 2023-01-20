const mysql = require('mysql');
function ExecuteQuery(CategoryName, con, callback) {
  const insert_category_sql = "INSERT INTO productcategory(`CategoryName`) VALUES('" + CategoryName + "');";
  console.log(insert_category_sql);
  con.query(insert_category_sql, function (err) {
    if (err) throw err;
    callback();
  });
}
module.exports = { ExecuteQuery };
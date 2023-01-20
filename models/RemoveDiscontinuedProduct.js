const mysql = require('mysql');
function ExecuteQuery(ProductID, con, callback) {
  const delete_disc_prod_sql = "DELETE FROM `discontinuedproducts` WHERE ProductID = " + ProductID + ";";
  console.log(delete_disc_prod_sql);
  con.query(delete_disc_prod_sql, function (err) {
    if (err) throw err;
    callback();
  });
}
module.exports = { ExecuteQuery };
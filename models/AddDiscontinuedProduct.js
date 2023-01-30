function ExecuteQuery(ProductID, con, callback) {
  const insert_disc_prod_sql = "INSERT INTO discontinuedproducts(`ProductID`) VALUES(" + ProductID + ");";
  console.log(insert_disc_prod_sql);
  con.query(insert_disc_prod_sql, function (err) {
    if (err) throw err;
    callback();
  });
}
module.exports = { ExecuteQuery };
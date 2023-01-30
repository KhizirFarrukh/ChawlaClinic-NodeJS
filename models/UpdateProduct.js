function ExecuteQuery(data, con, callback) {
  const currentDate = new Date();
  const LastUpdatedDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getDate().toString().padStart(2, '0');
  var update_sql = "UPDATE products prod JOIN productinventory invent ON prod.ProductID = invent.ProductID SET prod.ProductPrice = " + data.ProductPrice + ", prod.LastUpdated = STR_TO_DATE('" + LastUpdatedDate + "','%Y-%m-%d'), invent.Quantity = " + data.ProductQty + ", invent.LastUpdated = STR_TO_DATE('" + LastUpdatedDate + "','%Y-%m-%d') where prod.ProductID = " + data.SaveProduct + ";";
  console.log(update_sql);
  con.query(update_sql, function (err) {
      if (err) throw err;
      callback();
  });
}
module.exports = { ExecuteQuery };
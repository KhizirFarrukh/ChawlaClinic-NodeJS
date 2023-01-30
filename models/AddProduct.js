function ExecuteQuery(data, con, callback) {
  const currentDate = new Date();
  const LastUpdatedDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getDate().toString().padStart(2, '0');
  const insert_product_sql = "INSERT INTO products(`ProductName`,`ProductCategoryID`,`ProductPrice`,`LastUpdated`) VALUES('" + data.AddProductName + "'," + data.AddProductCategory + "," + data.AddProductPrice + ",STR_TO_DATE('" + LastUpdatedDate + "','%Y-%m-%d'));";
  console.log(insert_product_sql);
  con.query(insert_product_sql, function (err, insert_product_result) {
    if (err) throw err;
    const ProductID = insert_product_result.insertId;
    const insert_inventory_sql = "INSERT INTO productinventory(`ProductID`,`Quantity`,`LastUpdated`) VALUES(" + ProductID + "," + data.AddProductQty + ",STR_TO_DATE('" + LastUpdatedDate + "','%Y-%m-%d'));";
    console.log(insert_inventory_sql);
    con.query(insert_inventory_sql, function (err) {
      if (err) throw err;
      callback();
    });
  });
}
module.exports = { ExecuteQuery };
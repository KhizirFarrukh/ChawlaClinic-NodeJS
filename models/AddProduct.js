async function getInsertProductQuery(AddProductName, AddProductCategory, AddProductPrice, LastUpdatedDate) {
  const sql = "INSERT INTO products(`ProductName`,`ProductCategoryID`,`ProductPrice`,`LastUpdated`) VALUES(?,?,?,STR_TO_DATE(?,'%Y-%m-%d'));";
  const values = [AddProductName, AddProductCategory, AddProductPrice, LastUpdatedDate];

  return [sql, values];
}

async function getInsertInventoryQuery(ProductID, AddProductQty, LastUpdatedDate) {
  const sql = "INSERT INTO productinventory(`ProductID`,`Quantity`,`LastUpdated`) VALUES(?,?,STR_TO_DATE(?,'%Y-%m-%d'));";
  const values = [ProductID, AddProductQty, LastUpdatedDate];

  return [sql, values];
}

async function ExecuteQuery(data, db_pool) {
	let conn;
	try {
    const currentDate = new Date();
    const LastUpdatedDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getDate().toString().padStart(2, '0');

		conn = await db_pool.getConnection();
		await conn.beginTransaction();

    const [InsertProduct_SQL, InsertProduct_Values] = await getInsertProductQuery(data.AddProductName, data.AddProductCategory, data.AddProductPrice, LastUpdatedDate);
		console.log(InsertProduct_SQL, InsertProduct_Values);

		const [InsertProduct_Result] = await conn.query(InsertProduct_SQL, InsertProduct_Values);
		console.log(InsertProduct_Result);
		const ProductID = InsertProduct_Result.insertId;

    const [InsertInventory_SQL, InsertInventory_Values] = await getInsertInventoryQuery(ProductID, data.AddProductQty, LastUpdatedDate);
		console.log(InsertInventory_SQL, InsertInventory_Values);

		await conn.query(InsertInventory_SQL, InsertInventory_Values);
    
    await conn.commit();
		console.log('Transaction committed AddProduct.');

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };
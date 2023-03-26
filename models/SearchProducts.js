async function getQuery(searchQuery) {
	const sql = "SELECT prod.ProductID, prod.ProductName, prod.ProductPrice, invent.Quantity FROM products prod JOIN productinventory invent on prod.ProductID = invent.ProductID JOIN productcategory categ on categ.CategoryID = prod.ProductCategoryID WHERE categ.CategoryName != 'Dressing Pad' and categ.CategoryName != 'General homoeo medicine' AND LOWER(prod.ProductName) LIKE CONCAT('%', ?, '%') AND prod.ProductID NOT IN (SELECT ProductID FROM `discontinuedproducts`) ORDER BY prod.ProductName ASC;";
	const values = [searchQuery];

	return [sql, values];
}

async function ExecuteQuery(searchQuery, db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		const [sql, values] = await getQuery(searchQuery);
		console.log(sql, values);

		const [rows] = await conn.query(sql, values);
		return rows;

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };
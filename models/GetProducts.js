async function getQuery() {
	const sql = "SELECT prod.ProductID, prod.ProductName, prod.ProductPrice, prod.ProductCategoryID, categ.CategoryName, invent.Quantity FROM products prod JOIN productcategory categ ON prod.ProductCategoryID = categ.CategoryID JOIN productinventory invent ON prod.ProductID = invent.ProductID WHERE categ.CategoryName != 'Dressing Pad' AND prod.ProductID NOT IN (SELECT ProductID FROM discontinuedproducts) ORDER BY LOWER(prod.ProductName) ASC;"; // add not condition for general medicines when they are added
	
	return sql;
}

async function ExecuteQuery(db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		const sql = await getQuery();
		console.log(sql);

		const [rows] = await conn.query(sql);
		return rows;

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };
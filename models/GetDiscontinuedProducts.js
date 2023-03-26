async function getQuery() {
	const sql = "SELECT disc_prods.ProductID, prods.ProductName, prods.ProductPrice, categ.CategoryName FROM `discontinuedproducts` disc_prods JOIN `products` prods ON disc_prods.ProductID = prods.ProductID JOIN `productcategory` categ ON prods.ProductCategoryID = categ.CategoryID;";
	
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
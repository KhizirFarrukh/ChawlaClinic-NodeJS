async function getQuery(padQty, padFraction) {
	if(padFraction !== "0") {
		const sql = "SELECT prod.ProductName, prod.ProductPrice FROM products prod JOIN productcategory cat on prod.ProductCategoryID = cat.CategoryID where cat.CategoryName = 'Dressing Pad' AND ProductName = 'Dressing Pad 1' OR ProductName = ?;";
		let value = 'Dressing Pad ' + padFraction;
		
		if(padQty > 0) {
			value += " above 1";
		} else {
			value += " below 1";
		}
		
		return [sql, value];
	} else {
		const sql = "SELECT prod.ProductName, prod.ProductPrice FROM products prod JOIN productcategory cat on prod.ProductCategoryID = cat.CategoryID where cat.CategoryName = 'Dressing Pad' AND ProductName = 'Dressing Pad 1';";
		
		const value = undefined;
		return [sql, value];
	}
}

async function ExecuteQuery(padQty, padFraction, db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();
		
		const [sql, value] = getQuery(padQty, padFraction);
		console.log(sql, value);

		const [rows] = await conn.query(sql, [value]);

		let PadPrice = 0;
		PadPrice += rows.find(object => object.ProductName === "Dressing Pad 1").ProductPrice * parseInt(padQty);
		if(padFraction !== "0") {
			PadPrice += rows.find(object => object.ProductName.includes("Dressing Pad " + padFraction)).ProductPrice; 
		}

		return PadPrice;

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { getQuery, ExecuteQuery };
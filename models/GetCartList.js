async function getQuery(PatientID) {
	const sql = "SELECT prod.ProductID, prod.ProductName, cart.Quantity, prod.ProductPrice FROM products prod JOIN patientproductscart cart on prod.ProductID = cart.ProductID where cart.PatientID = ?;";
	const values = [PatientID];

	return [sql, values];
}

async function ExecuteQuery(PatientID, db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		const [sql, values] = await getQuery(PatientID);
		console.log(sql, values)

		const [rows] = await conn.query(sql, values);

		const TotalAmount = rows.reduce((total, cartItem) => total + (cartItem.ProductPrice * cartItem.Quantity), 0);
		console.log("Total Amount : " + TotalAmount);
		
		return [rows, TotalAmount];

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { getQuery, ExecuteQuery };
async function getQuery(id, data_depositamount, data_depositdate) {
	const sql = "INSERT INTO patientpaymentrecord(`PatientID`,`TotalAmount`,`AmountPaid`,`AmountReduction`,`Date`) VALUES(?,0,?,0,STR_TO_DATE(?,'%Y-%m-%d'));";
	const values = [id, data_depositamount, data_depositdate];

	return [sql, values];
}

async function ExecuteQuery(id, data, db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();
		
		const [sql, values] = await getQuery(id, data.depositamount, data.depositdate);
		console.log(sql, values);

		await conn.query(sql, values);

		await conn.commit();
		console.log('Transaction committed DepositAmount.');

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };
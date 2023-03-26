async function getSelectQuery(prodID, patientID) {
	const sql = "SELECT * FROM patientproductscart WHERE ProductID = ? AND PatientID = ?;";
	const values = [prodID, patientID];
	
	return [sql, values];
}

async function getInsertQuery(prodID, patientID) {
	const sql = "INSERT INTO patientproductscart(`ProductID`,`PatientID`,`Quantity`) VALUES(?,?,1);";
	const values = [prodID, patientID];
	
	return [sql, values];
}

async function getUpdate_IncQtyQuery(prodID, patientID) {
	const sql = "UPDATE patientproductscart SET Quantity = Quantity + 1 WHERE ProductID = ? AND PatientID = ?;";
	const values = [prodID, patientID];
	
	return [sql, values];
}

async function getUpdate_DecQtyQuery(prodID, patientID) {
	const sql = "UPDATE patientproductscart SET Quantity = Quantity - 1 WHERE ProductID = ? AND PatientID = ?;";
	const values = [prodID, patientID];
	
	return [sql, values];
}

async function getDeleteQuery(prodID, patientID) {
	const sql = "DELETE FROM patientproductscart WHERE ProductID = ? AND PatientID = ?;";
	const values = [prodID, patientID];
	
	return [sql, values];
}

async function getDataModificationQuery(rows_length, prodID, patientID, QuantityAdjustment, currentQuantity) {
	console.log("rows length", rows_length);
	let sql = "";
	let values = [];
	if (rows_length === 0) {
		if (QuantityAdjustment === 1) {
			[sql, values] = await getInsertQuery(prodID,patientID);
		}
	} else if (rows_length > 0) {
		if (QuantityAdjustment === 1) {
			[sql, values] = await getUpdate_IncQtyQuery(prodID,patientID)
		} else if (QuantityAdjustment === -1) {
			if (currentQuantity === 1) {
				[sql, values] = await getDeleteQuery(prodID,patientID);
			} else if (currentQuantity > 1) {
				[sql, values] = await getUpdate_DecQtyQuery(prodID,patientID);
			}
		}
	}
	return [sql, values];
}

async function ExecuteQuery(prodID, patientID, QuantityAdjustment, db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		const [sql_Select, values_Select] = await getSelectQuery(prodID, patientID);
		console.log(sql_Select, values_Select);

		const [rows] = await conn.query(sql_Select, values_Select);
		const rows_length = rows.length;
		// const currentQuantity = rows[0].Quantity;
		const currentQuantity = rows.length > 0 && rows[0].Quantity !== undefined ? rows[0].Quantity : 0;

		const [sql_DML, values_DML] = await getDataModificationQuery(rows_length, prodID, patientID, QuantityAdjustment, currentQuantity);
		console.log(sql_Select, values_Select);

		await conn.query(sql_DML, values_DML);

		await conn.commit();
		console.log('Transaction committed CartManagement.');

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };
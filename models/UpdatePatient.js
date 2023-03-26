async function updatePatientQuery(PatientName, Age, Gender, GuardianName, Type, Disease, Address, Status, PhoneNumber, FirstVisit, DiscountMode, ID) {
  const sql = "UPDATE patientdetails SET PatientName = ?, Age = ?, Gender = ?, GuardianName = ?, Type = ?, Disease = ?, Address = ?, Status = ?, PhoneNumber = ?, FirstVisit = STR_TO_DATE(?,'%Y-%m-%d'), DiscountMode = ? WHERE PatientID = ?;";
	const values = [PatientName, Age, Gender, GuardianName, Type, Disease, Address, Status, PhoneNumber, FirstVisit, DiscountMode, ID];

  return [sql, values];
}

async function ExecuteQuery(id, data, db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		let Age = parseFloat(data.ageyears) + parseFloat(data.agemonths / 12);
		Age = parseFloat(Age).toFixed(3);

		const [sql, values] = await updatePatientQuery(data.patientname, Age, data.gender, data.guardianname, data.type, data.disease, data.address, data.status, data.phonenum, data.firstvisit, data.discountmode, id);

		console.log(sql, values);

		await conn.query(sql, values);

		await conn.commit();
		console.log('Transaction committed UpdatePatient.');

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };
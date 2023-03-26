async function getCaseNoCountQuery(CaseNoFetchParam, InputCaseNo) {
  const sql = "SELECT count(`CaseNo`) AS \"CaseCount\" FROM patientdetails WHERE `CaseNo` LIKE ? AND CaseNo != 'Guest';";
  const values = [CaseNoFetchParam + "%" + InputCaseNo];

  return [sql, values];
}

async function getMaxCaseNoQuery(CaseNoFetchParam) {
  const sql = "SELECT MAX(`CaseNo`) AS \"CaseMax\" FROM patientdetails WHERE `CaseNo` LIKE ? AND CaseNo != 'Guest';";
  const values = [CaseNoFetchParam + "%"];

  return [sql, values];
}

async function insertPatientDataQuery(NewCaseNo, Type, PatientName, Age, Gender, GuardianName, Disease, Address, PhoneNumber, FirstVisit) {
  const sql = "INSERT INTO patientdetails(`CaseNo`,`Type`,`PatientName`,`Age`,`Gender`,`GuardianName`,`Disease`,`Address`,`PhoneNumber`,`FirstVisit`) VALUES(?,?,?,?,?,?,?,?,?,STR_TO_DATE(?,'%Y-%m-%d'));";
  const values = [NewCaseNo, Type, PatientName, Age, Gender, GuardianName, Disease, Address, PhoneNumber, FirstVisit];

  return [sql, values];
}

async function ExecuteQuery(data, db_pool) {
	const Type = "B";
	const PatientName = data.patientname;
	let Age = parseFloat(data.ageyears) + parseFloat(data.agemonths / 12);
	Age = parseFloat(Age).toFixed(3); // merge this with above line and make age variable constant
	const Gender = data.gender;
	const GuardianName = data.guardianname;
	const Disease = data.disease;
	const Address = data.address;
	const PhoneNumber = data.phonenum;
	const FirstVisit = data.firstvisit;
	const InputCaseNo = data.caseno;
	let NewCaseNo = "";
	const CaseNoFetchParam = String((new Date(data.firstvisit)).getFullYear() % 100) + Type + "-";
	NewCaseNo += CaseNoFetchParam;

	let conn;
	try {
    conn = await db_pool.getConnection();
		await conn.beginTransaction();

		if (InputCaseNo !== undefined) {
			const [getCaseNoCount_SQL, getCaseNoCount_Values] = await getCaseNoCountQuery(CaseNoFetchParam, InputCaseNo);
			console.log(getCaseNoCount_SQL, getCaseNoCount_Values);

			const [getCaseNoCount_Rows] = await conn.query(getCaseNoCount_SQL, getCaseNoCount_Values);

			NewCaseNo += String(parseInt(getCaseNoCount_Rows[0].CaseCount)).padStart(2, '0') + InputCaseNo;

		} else {
			const [getMaxCaseNo_SQL, getMaxCaseNo_Values] = await getMaxCaseNoQuery(CaseNoFetchParam);
			console.log(getMaxCaseNo_SQL, getMaxCaseNo_Values);

			const [getMaxCaseNo_Rows] = await conn.query(getMaxCaseNo_SQL, getMaxCaseNo_Values);
			console.log("Max CaseNo:", getMaxCaseNo_Rows[0].CaseMax);

			if (getMaxCaseNo_Rows[0].CaseMax === null) {
				NewCaseNo += String(1).padStart(6, '0');
			} else {
				NewCaseNo += String(parseInt((getMaxCaseNo_Rows[0].CaseMax).slice(4, 10)) + 1).padStart(6, '0');
			}
		}

		console.log("New CaseNo:", NewCaseNo);

    const [InsertPatientData_SQL, InsertPatientData_Value] = await insertPatientDataQuery(NewCaseNo, Type, PatientName, Age, Gender, GuardianName, Disease, Address, PhoneNumber, FirstVisit);
    console.log(InsertPatientData_SQL, InsertPatientData_Value);

    const InsertPatientData_Result = await conn.query(InsertPatientData_SQL, InsertPatientData_Value);
    const PatientID = InsertPatientData_Result[0].insertId;
		console.log("Inserted patient ID:", PatientID);

    await conn.commit();
    console.log('Transaction committed AddPatient.');

    return PatientID;
	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };
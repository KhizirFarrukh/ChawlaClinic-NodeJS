async function getInsertToTokenNumbersQuery(NewTokenNumber, TokenType, TokenPatientID, TokenName, TokenDateTime) {
  const sql = "INSERT INTO patienttokennumbers(`TokenNumber`, `TokenType`, `PatientID`, `PatientName`, `TokenDateTime`) VALUES(?,?,?,?,?);";
  const values = [NewTokenNumber, TokenType, TokenPatientID, TokenName, TokenDateTime];

  return [sql, values];
}

async function getInsertToTokenLogsQuery(NewTokenNumber, TokenType, TokenPatientID, TokenName, TokenDateTime) {
  const sql = "INSERT INTO patienttokenlogs(`TokenNumber`, `TokenType`, `PatientID`, `PatientName`, `TokenDateTime`) VALUES(?,?,?,?,?);";
  const values = [NewTokenNumber, TokenType, TokenPatientID, TokenName, TokenDateTime];

  return [sql, values];
}

async function ExecuteQuery(TokenPatientID, TokenName, TokenType, TokenDateTime, GetTokenInfo, PatientData, db_pool) {
	let conn;
	try {
    
    if(TokenPatientID === undefined) { 
      TokenPatientID = null;
    } else {
      TokenName = PatientData[0].PatientName;
      const PatientAge = PatientData[0].Age;
      const PatientGender = PatientData[0].Gender;

      if(PatientAge < 12) {
        TokenType = "Child";
      } else {
        if(PatientGender === "M") {
          TokenType = "Male";
        } else if(PatientGender === "F") {
          TokenType = "Female";
        }
      }
    }
    
    conn = await db_pool.getConnection();
		await conn.beginTransaction();

    const [getMaxTokenCount_SQL, getMaxTokenCount_Value] = await GetTokenInfo.getMaxCountQuery(TokenType);
    console.log(getMaxTokenCount_SQL, getMaxTokenCount_Value);

    const [getMaxTokenCount_Rows] = await conn.query(getMaxTokenCount_SQL, getMaxTokenCount_Value);

    console.log("Max Token Count:", getMaxTokenCount_Rows);

    const MaxTokenValue = getMaxTokenCount_Rows[0].MaxTokenNum;

    let NewTokenNumber;

    if(MaxTokenValue !== null) {
      NewTokenNumber = parseInt(MaxTokenValue) + 1;
    } else {
      NewTokenNumber = 1;
    }

    console.log("New Token Number:", NewTokenNumber);

    console.log(TokenDateTime);

    const [InsertToTokenNumbers_SQL, InsertToTokenNumbers_Values] = await getInsertToTokenNumbersQuery(NewTokenNumber, TokenType, TokenPatientID, TokenName, TokenDateTime);

    const InsertToTokenNumbers_Result = await conn.query(InsertToTokenNumbers_SQL, InsertToTokenNumbers_Values);
    const TokenID = InsertToTokenNumbers_Result[0].insertId;

    const [InsertToTokenLogs_SQL, InsertToTokenLogs_Value] = await getInsertToTokenLogsQuery(NewTokenNumber, TokenType, TokenPatientID, TokenName, TokenDateTime);
    console.log(InsertToTokenLogs_SQL, InsertToTokenLogs_Value);
    
    await conn.query(InsertToTokenLogs_SQL, InsertToTokenLogs_Value);

    await conn.commit();
    console.log('Transaction committed AddTokenInfo.');

    return [NewTokenNumber, TokenType, TokenID];
	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };
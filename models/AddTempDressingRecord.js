async function getQuery(data, PatientID, PadPrice) {
  const sql = "INSERT INTO patientdressingtemphold(`PatientID`,`DressingDate`,`QtyOfPads`,`TotalAmount`) VALUES(?,STR_TO_DATE(?,'%Y-%m-%d'),?,?);";
  if(data.customprice !== "") {
    if (/^\d+$/.test(data.customprice)) {
      const customPrice = parseInt(data.customprice);
      const padQty = parseFloat(data.padquantity) + parseFloat(eval(data.padfraction));
      
      const values = [PatientID, data.dressingdate, padQty, customPrice];

      return [sql, values];
    }
  } else {
    const padQty = parseFloat(data.padquantity) + parseFloat(eval(data.padfraction));
    
    const values = [PatientID, data.dressingdate, padQty, PadPrice];

    return [sql, values];
  }
}

async function ExecuteQuery(data, PatientID, GetPadPricing, db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();
    
    const [GetPadPricing_SQL, GetPadPricing_Value] = await GetPadPricing.getQuery(data.padquantity, data.padfraction);
    console.log(GetPadPricing_SQL, GetPadPricing_Value);

    const [GetPadPricing_Rows] = await conn.query(GetPadPricing_SQL, [GetPadPricing_Value]);

    console.log(GetPadPricing_Rows);

    let PadPrice = 0;
		PadPrice += GetPadPricing_Rows.find(object => object.ProductName === "Dressing Pad 1").ProductPrice * parseInt(data.padquantity);
		if(data.padfraction !== "0") {
			PadPrice += GetPadPricing_Rows.find(object => object.ProductName.includes("Dressing Pad " + data.padfraction)).ProductPrice; 
		}

		const [sql, values] = await getQuery(data, PatientID, PadPrice);
    console.log(sql, values)

		await conn.query(sql, values);

		await conn.commit();

		console.log('Transaction committed AddTempDressingRecord.');

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };
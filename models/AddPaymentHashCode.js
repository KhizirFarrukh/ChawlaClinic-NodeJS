async function getHashValue(PaymentID) {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  const random_length = 3;
  let id = PaymentID;
  let Hash_Value = "";

  while (id >= charactersLength) {
    let div = Math.floor(id / charactersLength);
    let mod = id % charactersLength;
    Hash_Value = characters[mod] + Hash_Value;
    id = div;
  }
  Hash_Value = characters[id] + Hash_Value;

  let counter = 0;
  while (counter < random_length) {
    Hash_Value += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  console.log("Payment ID, Hash Value: ", PaymentID, Hash_Value);

  return Hash_Value;
}

async function getQuery(PaymentID, Hash_Value) {
  const sql = "INSERT INTO patientpaymentsidentifiers(`PaymentID`,`PaymentHashCode`) VALUES(?,?);";
  const values = [PaymentID, Hash_Value];

  return [sql, values];
}

async function ExecuteQuery(PaymentID, db_pool) {
	let conn;
	try {
    const Hash_Value = await getHashValue(PaymentID);

		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		const [sql, values] = await getQuery(PaymentID, Hash_Value);
		console.log(sql, values);

		await conn.query(sql, values);
		
    await conn.commit();
		console.log('Transaction committed AddPaymentHashCode.');

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };
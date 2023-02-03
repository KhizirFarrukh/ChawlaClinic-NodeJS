function ExecuteQuery(PaymentID, con, callback) {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  const random_length = 3;
  var id = PaymentID;
  var Hash_Value = "";

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

  const insert_payment_hashID_sql = "INSERT INTO patientpaymentsidentifiers(`PaymentID`,`PaymentHashCode`) VALUES(" + PaymentID + ",'" + Hash_Value + "');";
  console.log(insert_payment_hashID_sql);
  con.query(insert_payment_hashID_sql, function (err) {
    if (err) throw err;
    callback(Hash_Value);
  });
  
}
module.exports = { ExecuteQuery };
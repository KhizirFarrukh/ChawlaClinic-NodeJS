const mysql = require('mysql');

function ExecuteQuery(id, retrieveLimit, con, callback) {
  // var dressing_sql = "SELECT dressing.QtyOfPads AS \"DressingPads\" from patientdressingrecord dressing where dressing.PaymentID = " + payment_id;

  var dressing_sql = "SELECT payment.PaymentID, dressing.QtyOfPads FROM patientdressingrecord dressing RIGHT JOIN patientpaymentrecord payment ON dressing.PaymentID = payment.PaymentID WHERE payment.PatientID = " + id;
  
  if(retrieveLimit == true ) {
    dressing_sql += " LIMIT 5";
  }

  console.log(dressing_sql);
  
  con.query(dressing_sql, function (err, dressingResult) {
    if (err) throw err;

    // console.log(dressingResult);
    var dressing_details = Object.values(JSON.parse(JSON.stringify(dressingResult)));
    // console.log(dressing_details);

    callback(dressing_details);
  });
}

module.exports = { ExecuteQuery };
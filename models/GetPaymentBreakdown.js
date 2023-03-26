async function getPatientIDQuery(id, retrieveLimit) {
	let sql = "SELECT pay.PaymentID, pay.TotalAmount, pay.AmountPaid, pay.AmountReduction AS \"Discount\", disc.DiscountOption, pay.Date, DressingSum.DressingCharges, OintmentSum.OintmentCharges, OtherProdsSum.ProductCharges from patientpaymentrecord pay left join (SELECT pay.PaymentID, SUM(dressing.TotalAmount) AS \"DressingCharges\" FROM patientpaymentrecord pay left join patientdressingrecord dressing on pay.PaymentID = dressing.PaymentID WHERE pay.PaymentID IN (SELECT pay.PaymentID from patientpaymentrecord pay where pay.PatientID = ?) group by pay.PaymentID) AS DressingSum on pay.PaymentID = DressingSum.PaymentID left join (SELECT pay.PaymentID, SUM(ointmentpurchase.Amount) AS \"OintmentCharges\" FROM patientpaymentrecord pay left join patientproductspurchased prodpurchase on pay.PaymentID = prodpurchase.PaymentID left JOIN patientointmentpurchased ointmentpurchase ON prodpurchase.PurchaseID = ointmentpurchase.PurchaseID WHERE pay.PaymentID IN (SELECT pay.PaymentID from patientpaymentrecord pay where pay.PatientID = ?) group by pay.PaymentID) AS OintmentSum ON pay.PaymentID = OintmentSum.PaymentID left join (SELECT pay.PaymentID, SUM(otherprods.Amount) AS \"ProductCharges\" FROM patientpaymentrecord pay left join patientproductspurchased prodpurchase on pay.PaymentID = prodpurchase.PaymentID left JOIN patientotherprodspurchased otherprods ON prodpurchase.PurchaseID = otherprods.PurchaseID WHERE pay.PaymentID IN (SELECT pay.PaymentID from patientpaymentrecord pay where pay.PatientID = ?) group by pay.PaymentID) AS OtherProdsSum ON pay.PaymentID = OtherProdsSum.PaymentID left join paymentdiscounts disc on pay.PaymentID = disc.PaymentID where pay.PatientID = ? group by pay.PaymentID order by pay.Date DESC, pay.PaymentID DESC";
	if(retrieveLimit === true ) {
		sql += " LIMIT 5";
	}

	const values = [id,id,id,id];

	return [sql, values];
}

async function getPaymentIDQuery(id) {
	const sql = "SELECT pay.PatientID, patient.PatientName, pay.PaymentID, pay.TotalAmount, pay.AmountPaid, pay.AmountReduction AS \"Discount\", disc.DiscountOption, pay.Date, DressingSum.DressingCharges, OintmentSum.OintmentCharges, OtherProdsSum.ProductCharges from patientpaymentrecord pay join patientdetails patient ON pay.PatientID = patient.PatientID left join (SELECT pay.PaymentID, SUM(dressing.TotalAmount) AS \"DressingCharges\" FROM patientpaymentrecord pay left join patientdressingrecord dressing on pay.PaymentID = dressing.PaymentID WHERE pay.PaymentID IN (SELECT pay.PaymentID from patientpaymentrecord pay where pay.PaymentID = ?)) AS DressingSum on pay.PaymentID = DressingSum.PaymentID left join (SELECT pay.PaymentID, SUM(ointmentpurchase.Amount) AS \"OintmentCharges\" FROM patientpaymentrecord pay left join patientproductspurchased prodpurchase on pay.PaymentID = prodpurchase.PaymentID left JOIN patientointmentpurchased ointmentpurchase ON prodpurchase.PurchaseID = ointmentpurchase.PurchaseID WHERE pay.PaymentID IN (SELECT pay.PaymentID from patientpaymentrecord pay where pay.PaymentID = ?)) AS OintmentSum ON pay.PaymentID = OintmentSum.PaymentID left join (SELECT pay.PaymentID, SUM(otherprods.Amount) AS \"ProductCharges\" FROM patientpaymentrecord pay left join patientproductspurchased prodpurchase on pay.PaymentID = prodpurchase.PaymentID left JOIN patientotherprodspurchased otherprods ON prodpurchase.PurchaseID = otherprods.PurchaseID WHERE pay.PaymentID IN (SELECT pay.PaymentID from patientpaymentrecord pay where pay.PaymentID = ?)) AS OtherProdsSum ON pay.PaymentID = OtherProdsSum.PaymentID left join paymentdiscounts disc on pay.PaymentID = disc.PaymentID where pay.PaymentID = ?;";
	const values = [id,id,id,id];

	return [sql, values];
}

async function ExecuteQuery(id, ID_represents, retrieveLimit, db_pool) {
	let conn;
	try {
		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		let sql, values;
		if(ID_represents === "Patient") {
			[sql, values] = await getPatientIDQuery(id, retrieveLimit);
		} else if(ID_represents === "Payment") {
			[sql, values] = await getPaymentIDQuery(id);
		}

		console.log(sql, values);

		const [rows] = await conn.query(sql, values);

		let result = Object.values(JSON.parse(JSON.stringify(rows)));

		return result;

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };
async function getInsertToPaymentsQuery(PatientID, PaymentTotalAmount, AmountPaid, AmountReduction, PurchaseDate) {
	const sql = "INSERT INTO patientpaymentrecord(`PatientID`,`TotalAmount`,`AmountPaid`,`AmountReduction`,`Date`) VALUES(?,?,?,?,STR_TO_DATE(?,'%Y-%m-%d'));";
	const values = [PatientID, PaymentTotalAmount, AmountPaid, AmountReduction, PurchaseDate];

	return [sql, values];
}

async function getInsertToPaymentDiscountsQuery(PaymentID, DiscountOption) {
	const sql = "INSERT INTO paymentdiscounts(`PaymentID`,`DiscountOption`) VALUES(?,?);";
	const values = [PaymentID, DiscountOption];

	return [sql, values];
}

async function getInsertToPurchasesQuery(PaymentID, CartTotalAmount) {
	const sql = "INSERT INTO patientproductspurchased(`PaymentID`,`TotalAmount`) VALUES(?,?);";
	const values = [PaymentID, CartTotalAmount];

	return [sql, values];
}

async function getDeleteFromCartQuery(cartInfo_ProductID, PatientID) {
	const sql = "DELETE FROM patientproductscart WHERE ProductID = ? AND PatientID = ?;";
	const values = [cartInfo_ProductID, PatientID];

	return [sql, values];
}

async function getInsertToPurchasedItemsQuery(PurchaseID, cartInfo_ProductID, cartInfo_Quantity, cartInfo_ProductPrice) {
	const Amount = (cartInfo_ProductPrice * cartInfo_Quantity)
	const sql = "INSERT INTO patientproductspurchaseditems(`PurchaseID`,`ProductID`,`Quantity`,`Amount`) VALUES(?,?,?,?);";
	const values = [PurchaseID, cartInfo_ProductID, cartInfo_Quantity, Amount];

	return [sql, values];
}

async function getDeleteFromTempDressingHoldQuery(tempDressingResult_TempID) {
	const sql = "DELETE FROM patientdressingtemphold WHERE TempID = ?;";
	const values = [tempDressingResult_TempID];

	return [sql, values];
}

async function getInsertToDressingRecordQuery(PaymentID, DressingPadQty, DressingTotalAmount, DressingDate) {
	const sql = "INSERT INTO patientdressingrecord(`PaymentID`,`QtyOfPads`,`TotalAmount`,`DressingDate`) VALUES(?,?,?,STR_TO_DATE(?,'%d-%m-%Y'));";
	const values = [PaymentID, DressingPadQty, DressingTotalAmount, DressingDate];

	return [sql, values];
}

async function ExecuteQuery(PatientID, PurchaseDate, AmountPaid, AmountReduction, DiscountOption, GetCartList, GetTempDressingRecord, isGuest, db_pool) {
	let conn;
	try {
		let PaymentTotalAmount = 0;

		conn = await db_pool.getConnection();
		await conn.beginTransaction();

		const [GetTempDressingRecord_SQL, GetTempDressingRecord_Values] = await GetTempDressingRecord.getQuery(PatientID);
		console.log(GetTempDressingRecord_SQL, GetTempDressingRecord_Values);

		const [GetTempDressingRecord_Rows] = await conn.query(GetTempDressingRecord_SQL, GetTempDressingRecord_Values);
		console.log("GetTempDressingRecord:", GetTempDressingRecord_Rows);

		DressingTotalAmount = GetTempDressingRecord_Rows.reduce((total, tempDressing) => total + tempDressing.TotalAmount, 0);
		PaymentTotalAmount += GetTempDressingRecord_Rows.reduce((total, tempDressing) => total + tempDressing.TotalAmount, 0);

		const [GetCartList_SQL, GetCartList_Values] = await GetCartList.getQuery(PatientID);
		console.log(GetCartList_SQL, GetCartList_Values);

		const [GetCartList_Rows] = await conn.query(GetCartList_SQL, GetCartList_Values);

		const TotalAmount = GetCartList_Rows.reduce((total, cartItem) => total + (cartItem.ProductPrice * cartItem.Quantity), 0);
		console.log("Total Amount : " + TotalAmount);

		console.log("GetCartList:", GetCartList_Rows);
		PaymentTotalAmount += TotalAmount;

		if (isGuest) { AmountPaid = PaymentTotalAmount; }

		const [InsertToPayments_SQL, InsertToPayments_Values] = await getInsertToPaymentsQuery(PatientID, PaymentTotalAmount, AmountPaid, AmountReduction, PurchaseDate);
		console.log(InsertToPayments_SQL, InsertToPayments_Values);

		const [InsertToPayments_Result] = await conn.query(InsertToPayments_SQL, InsertToPayments_Values);
		const PaymentID = InsertToPayments_Result.insertId;
		
		if (AmountReduction > 0) {
			const [InsertToPaymentDiscounts_SQL, InsertToPaymentDiscounts_Values] = await getInsertToPaymentDiscountsQuery(PaymentID, DiscountOption);
			console.log(InsertToPaymentDiscounts_SQL, InsertToPaymentDiscounts_Values);

			await conn.query(InsertToPaymentDiscounts_SQL, InsertToPaymentDiscounts_Values);
		}

		if (GetCartList_Rows.length > 0) {
			const [InsertToPurchases_SQL, InsertToPurchases_Values] = await getInsertToPurchasesQuery(PaymentID, TotalAmount);
			console.log(InsertToPurchases_SQL, InsertToPurchases_Values);

			const [InsertToPurchases_Result] = await conn.query(InsertToPurchases_SQL, InsertToPurchases_Values);
			const PurchaseID = InsertToPurchases_Result.insertId;

			for (let i = 0; i < GetCartList_Rows.length; i += 1) {
				const [DeleteFromCart_SQL, DeleteFromCart_Values] = await getDeleteFromCartQuery(GetCartList_Rows[i].ProductID, PatientID);
				console.log(DeleteFromCart_SQL, DeleteFromCart_Values);
				
				await conn.query(DeleteFromCart_SQL, DeleteFromCart_Values);

				const [InsertToPurchasedItems_SQL, InsertToPurchasedItems_Values] = await getInsertToPurchasedItemsQuery(PurchaseID, GetCartList_Rows[i].ProductID, GetCartList_Rows[i].Quantity, GetCartList_Rows[i].ProductPrice);
				console.log(InsertToPurchasedItems_SQL, InsertToPurchasedItems_Values);

				await conn.query(InsertToPurchasedItems_SQL, InsertToPurchasedItems_Values);
			}
		}

		for (let i = 0; i < GetTempDressingRecord_Rows.length; i++) {
			console.log(GetTempDressingRecord_Rows[i]);

			const [DeleteFromTempDressingHold_SQL, DeleteFromTempDressingHold_Values] = await getDeleteFromTempDressingHoldQuery(GetTempDressingRecord_Rows[i].TempID);
			console.log(DeleteFromTempDressingHold_SQL, DeleteFromTempDressingHold_Values);

			await conn.query(DeleteFromTempDressingHold_SQL, DeleteFromTempDressingHold_Values);

			const theDate = new Date(GetTempDressingRecord_Rows[i].DressingDate);
			const DressingDate = String(theDate.getDate()).padStart(2, '0') + "-" + String(theDate.getMonth() + 1).padStart(2, '0') + "-" + theDate.getFullYear();
			const DressingTotalAmount = GetTempDressingRecord_Rows[i].TotalAmount;
			const DressingPadQty = GetTempDressingRecord_Rows[i].QtyOfPads;
			console.log(DressingDate);

			const [InsertToDressingRecord_SQL, InsertToDressingRecord_Values] = await getInsertToDressingRecordQuery(PaymentID, DressingPadQty, DressingTotalAmount, DressingDate);
			console.log(InsertToDressingRecord_SQL, InsertToDressingRecord_Values);

			await conn.query(InsertToDressingRecord_SQL, InsertToDressingRecord_Values);
		}

		await conn.commit();
		console.log('Transaction committed ConfirmCartItems.');

		return PaymentID;

	} catch (error) {
		if (conn) { await conn.rollback(); }
		throw error;
	} finally {
		if (conn) { conn.release(); }
	}
}
module.exports = { ExecuteQuery };
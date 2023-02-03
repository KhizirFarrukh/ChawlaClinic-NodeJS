function ExecuteQuery(PatientID, PurchaseDate, AmountPaid, AmountReduction, DiscountOption, GetCartList, GetTempDressingRecord, AddPaymentHashCode, isGuest, con, callback) {
    var PaymentTotalAmount = 0;
    GetTempDressingRecord.ExecuteQuery(PatientID, con, function(tempDressingResult) {
        DressingTotalAmount = tempDressingResult.reduce((total, tempDressing) => total + tempDressing.TotalAmount, 0);
        PaymentTotalAmount += tempDressingResult.reduce((total, tempDressing) => total + tempDressing.TotalAmount, 0);
        GetCartList.ExecuteQuery(PatientID, con, function(cartInfo,CartTotalAmount){
            console.log(cartInfo);
            PaymentTotalAmount += CartTotalAmount;
            if(isGuest) { AmountPaid = PaymentTotalAmount; }
            var InsertToPaymentsSQL = "INSERT INTO patientpaymentrecord(`PatientID`,`TotalAmount`,`AmountPaid`,`AmountReduction`,`Date`) ";
            InsertToPaymentsSQL += "VALUES(" + PatientID + "," + PaymentTotalAmount + "," + AmountPaid + "," + AmountReduction + ",STR_TO_DATE('" + PurchaseDate + "','%Y-%m-%d'));";
            console.log(InsertToPaymentsSQL);
            con.query(InsertToPaymentsSQL, function (err, result) {
                if (err) throw err;
                console.log(result.insertId);
                var PaymentID = result.insertId;
                AddPaymentHashCode.ExecuteQuery(PaymentID, con, function(Payment_HashCode) {
                    if(AmountReduction > 0) {
                        var InsertToPaymentDiscountsSQL = "INSERT INTO paymentdiscounts(`PaymentID`,`DiscountOption`) VALUES(" + PaymentID + ",'" + DiscountOption + "');";
                        console.log(InsertToPaymentDiscountsSQL);
                        con.query(InsertToPaymentDiscountsSQL, function (err) {
                            if (err) throw err;
                        });
                    }
                    if(cartInfo.length > 0) {
                        var InsertToPurchasesSQL = "INSERT INTO patientproductspurchased(`PaymentID`,`TotalAmount`) ";
                        InsertToPurchasesSQL += "VALUES(" + PaymentID + "," + CartTotalAmount + ");";
                        console.log(InsertToPurchasesSQL);
                        con.query(InsertToPurchasesSQL, function (err, result) {
                            if (err) throw err;
                            console.log(result.insertId);
                            const PurchaseID = result.insertId;
                            for(let i=0;i<cartInfo.length;i+=1) {
                                var DeleteFromCartSQL = "DELETE FROM patientproductscart WHERE ProductID = " + cartInfo[i].ProductID + " AND PatientID = " + PatientID + ";";
                                console.log(DeleteFromCartSQL);
                                con.query(DeleteFromCartSQL, function (err) {
                                    if (err) throw err;
                                    var InsertToPurchasedItemsSQL = "INSERT INTO patientproductspurchaseditems(`PurchaseID`,`ProductID`,`Quantity`,`Amount`) VALUES(" + PurchaseID + "," + cartInfo[i].ProductID + "," + cartInfo[i].Quantity + "," + (cartInfo[i].ProductPrice * cartInfo[i].Quantity) + ");";
                                    console.log(InsertToPurchasedItemsSQL);
                                    con.query(InsertToPurchasedItemsSQL, function (err) {
                                        if (err) throw err;
                                    });
                                });
                            }
                        });
                    }
                    for(let i = 0; i < tempDressingResult.length; i++) {
                        console.log(tempDressingResult[i]);
                        var DeleteFromTempDressingHoldSQL = "DELETE FROM patientdressingtemphold WHERE TempID = " + tempDressingResult[i].TempID + ";";
                        console.log(DeleteFromTempDressingHoldSQL);
                        con.query(DeleteFromTempDressingHoldSQL, function (err) {
                            if (err) throw err;
                            const theDate = new Date(tempDressingResult[i].DressingDate);
                            const DressingDate = String(theDate.getDate()).padStart(2, '0' ) + "-" + String(theDate.getMonth() + 1).padStart(2, '0' ) + "-" + theDate.getFullYear();
                            const DressingTotalAmount = tempDressingResult[i].TotalAmount;
                            const DressingPadQty = tempDressingResult[i].QtyOfPads;
                            console.log(DressingDate);
                            var InsertToDressingRecordSQL = "INSERT INTO patientdressingrecord(`PaymentID`,`QtyOfPads`,`TotalAmount`,`DressingDate`) VALUES(" + PaymentID + "," + DressingPadQty + "," + DressingTotalAmount + ",STR_TO_DATE('" + DressingDate + "','%d-%m-%Y'));";
                            console.log(InsertToDressingRecordSQL);
                            con.query(InsertToDressingRecordSQL, function (err) {
                                if (err) throw err;
                            });
                        });
                    }
                    callback(PaymentID,Payment_HashCode);
                });
            });
        });
    });
}
module.exports = { ExecuteQuery };
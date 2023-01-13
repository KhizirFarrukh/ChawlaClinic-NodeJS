const mysql = require('mysql');

function ExecuteQuery(PatientID, PurchaseDate, AmountPaid, AmountReduction, DiscountOption, SQL_GetCartList, SQL_GetTempDressingRecord, con, callback) {
    var PaymentTotalAmount = 0;
    var DressingTotalAmount = 0;
    var DressingPadQty = 0.0;
    var DressingDate = undefined;
    SQL_GetTempDressingRecord.ExecuteQuery(PatientID, con, function(tempDressingResult) {
        if(tempDressingResult.length > 0) {
            DressingTotalAmount = tempDressingResult[0].TotalAmount;
            DressingPadQty = tempDressingResult[0].QtyOfPads;
            DressingDate = tempDressingResult[0].DressingDate;
        }
        PaymentTotalAmount += DressingTotalAmount;
        SQL_GetCartList.ExecuteQuery(PatientID, con, function(cartInfo,CartTotalAmount){
            console.log(cartInfo);
            PaymentTotalAmount += CartTotalAmount;
            var InsertToPaymentsSQL = "INSERT INTO patientpaymentrecord(`PatientID`,`TotalAmount`,`AmountPaid`,`AmountReduction`,`Date`) ";
            InsertToPaymentsSQL += "VALUES(" + PatientID + "," + PaymentTotalAmount + "," + AmountPaid + "," + AmountReduction + ",STR_TO_DATE('" + PurchaseDate + "','%Y-%m-%d'));";
            console.log(InsertToPaymentsSQL);
            con.query(InsertToPaymentsSQL, function (err, result) {
                if (err) throw err;
<<<<<<< HEAD
                console.log(result);
                var InsertToPaymentsSQL = "INSERT INTO patientpaymentrecord(`PatientID`,`TotalAmount`,`AmountPaid`,`AmountReduction`,`Date`) ";
                InsertToPaymentsSQL += "VALUES(" + PatientID + "," + (cartInfo[i].ProductPrice * cartInfo[i].Quantity) + "," + (cartInfo[i].ProductPrice * cartInfo[i].Quantity) + "," + 0 + ",STR_TO_DATE('" + PurchaseDate + "','%Y-%m-%d'));";
                console.log(InsertToPaymentsSQL);
                con.query(InsertToPaymentsSQL, function (err, result) {
                    if (err) throw err;
                    console.log(result);
                    console.log(result.insertId);
                    var PaymentID = result.insertId;
                    var InsertToPurchasesSQL = "INSERT INTO patientproductpurchasehistory(`PatientID`,`ProductID`,`PaymentID`,`Quantity`) ";
                    InsertToPurchasesSQL += "VALUES(" + PatientID + "," + cartInfo[i].ProductID + "," + PaymentID + "," + cartInfo[i].Quantity + ");";
=======
                // console.log(result);
                console.log(result.insertId);
                var PaymentID = result.insertId;
                if(AmountReduction > 0) {
                    var InsertToPaymentDiscountsSQL = "INSERT INTO paymentdiscounts(`PaymentID`,`DiscountOption`) VALUES(" + PaymentID + ",'" + DiscountOption + "');";
                    console.log(InsertToPaymentDiscountsSQL);
                    con.query(InsertToPaymentDiscountsSQL, function (err, result) {
                        if (err) throw err;
                        // console.log(result);
                    });
                }
                if(cartInfo.length > 0) {
                    var InsertToPurchasesSQL = "INSERT INTO patientproductspurchased(`PaymentID`,`TotalAmount`) ";
                    InsertToPurchasesSQL += "VALUES(" + PaymentID + "," + CartTotalAmount + ");";
>>>>>>> patientdetails
                    console.log(InsertToPurchasesSQL);
                    con.query(InsertToPurchasesSQL, function (err, result) {
                        if (err) throw err;
                        // console.log(result);
                        console.log(result.insertId);
                        const PurchaseID = result.insertId;
                        for(let i=0;i<cartInfo.length;i+=1) {
                            var DeleteFromCartSQL = "DELETE FROM patientproductscart WHERE ProductID = " + cartInfo[i].ProductID + " AND PatientID = " + PatientID + ";";
                            console.log(DeleteFromCartSQL);
                            con.query(DeleteFromCartSQL, function (err, result) {
                                if (err) throw err;
                                // console.log(result);
                                var InsertToPurchasedItemsSQL = "INSERT INTO patientproductspurchaseditems(`PurchaseID`,`ProductID`,`Quantity`,`Amount`) VALUES(" + PurchaseID + "," + cartInfo[i].ProductID + "," + cartInfo[i].Quantity + "," + (cartInfo[i].ProductPrice * cartInfo[i].Quantity) + ");";
                                console.log(InsertToPurchasedItemsSQL);
                                con.query(InsertToPurchasedItemsSQL, function (err, result) {
                                    if (err) throw err;
                                    // console.log(result);
                                });
                            });
                        }
                    });
                }
                if(tempDressingResult.length > 0) {
                    var DeleteFromTempDressingHoldSQL = "DELETE FROM patientdressingtemphold WHERE PatientID = " + PatientID + ";";
                    console.log(DeleteFromTempDressingHoldSQL);
                    con.query(DeleteFromTempDressingHoldSQL, function (err, result) {
                        if (err) throw err;
                        console.log(result);
                        console.log(DressingDate);
                        const theDate = new Date(DressingDate);
                        DressingDate = String(theDate.getDate()).padStart(2, '0' ) + "-" + String(theDate.getMonth() + 1).padStart(2, '0' ) + "-" + theDate.getFullYear();
                        var InsertToDressingRecordSQL = "INSERT INTO patientdressingrecord(`PaymentID`,`QtyOfPads`,`TotalAmount`,`DressingDate`) VALUES(" + PaymentID + "," + DressingPadQty + "," + DressingTotalAmount + ",STR_TO_DATE('" + DressingDate + "','%d-%m-%Y'));";
                        console.log(DressingDate);
                        console.log(InsertToDressingRecordSQL);
                        con.query(InsertToDressingRecordSQL, function (err, result) {
                            if (err) throw err;
                            // console.log(result);
                        });
                    });
                }
                callback();
            });
        });
    });
}
module.exports = { ExecuteQuery };
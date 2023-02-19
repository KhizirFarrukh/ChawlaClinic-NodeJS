const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');
const { exec } = require('child_process');

const db_connection = require('./models/db_connect');

const AddPaymentHashCode = require('./models/AddPaymentHashCode');
const GetPaymentIDFromHash = require('./models/GetPaymentIDFromHash');

const SQL_AddTokenInfo = require('./models/SQL_AddTokenInfo');
const SQL_GetTokenInfo = require('./models/SQL_GetTokenInfo');
const GetTokenInfoByID = require('./models/GetTokenInfoByID');
const SQL_ResetTokenData = require('./models/SQL_ResetTokenData');

const AddPatient = require('./models/AddPatient');
const SearchPatient = require('./models/SearchPatient');
const UpdatePatient = require('./models/UpdatePatient');
const GetDiscountMode = require('./models/GetDiscountMode');
const GetGuestPatient = require('./models/GetGuestPatient');

const GetCurrentBalance = require('./models/GetCurrentBalance');
const DepositAmount = require('./models/DepositAmount');

const GetPaymentSummary = require('./models/GetPaymentSummary');
const GetPaymentBreakdown = require('./models/GetPaymentBreakdown');
const GetDressingDetails = require('./models/GetDressingDetails');
const GetOintmentDetails = require('./models/GetOintmentDetails');
const GetProductDetails = require('./models/GetProductDetails');

const GetPadPricing = require('./models/GetPadPricing');

const AddTempDressingRecord = require('./models/AddTempDressingRecord');
const GetTempDressingRecord = require('./models/GetTempDressingRecord');
const RemoveTempDressingHold = require('./models/RemoveTempDressingHold');

const CartManagement = require('./models/CartManagement');
const GetCartList = require('./models/GetCartList');
const SearchProducts = require('./models/SearchProducts');
const ConfirmCartItems = require('./models/ConfirmCartItems');

const GetDressingPads = require('./models/GetDressingPads');
const UpdateDressingPad = require('./models/UpdateDressingPad');
const GetProductCategories = require('./models/GetProductCategories');
const AddProductCategory = require('./models/AddProductCategory'); 
const GetProducts = require('./models/GetProducts');
const AddProduct = require('./models/AddProduct');
const UpdateProduct = require('./models/UpdateProduct');
const AddDiscontinuedProduct = require('./models/AddDiscontinuedProduct');
const GetDiscontinuedProducts = require('./models/GetDiscontinuedProducts');
const RemoveDiscontinuedProduct = require('./models/RemoveDiscontinuedProduct');

const WebConfigData = fs.readFileSync('webconfig.json');
const WebConfig = JSON.parse(WebConfigData);

const isNumeric = str => /^\d+$/.test(str);
const isAlphaNumericLowercase = str => /^[a-z0-9]+$/.test(str);

function AddPaymentRecordCartGet(PatientID,searchResult,discountOption,res) {
	GetCartList.ExecuteQuery(PatientID, db_connection, function (cartInfo, TotalAmount) {
		console.log(cartInfo);
		GetTempDressingRecord.ExecuteQuery(PatientID, db_connection, function(tempDressingResult) {
			var totalAmount = TotalAmount;
			// totalAmount += tempDressingResult[0].TotalAmount;
			totalAmount += tempDressingResult.reduce((total, tempDressing) => total + tempDressing.TotalAmount, 0);
			console.log(totalAmount);
			console.log(tempDressingResult);
			GetGuestPatient.ExecuteQuery(db_connection, function(GuestPatient) {
				console.log(GuestPatient);
				var GuestMode = false;
				if(+PatientID === GuestPatient[0].PatientID) {
					GuestMode = true;
				}
				res.render('add-payment-record', { title: "Add Patient Payment Record | Chawla Clinic", DressingRecord_OnHold: tempDressingResult, SearchResult: searchResult, CartItems: cartInfo, TotalAmount: totalAmount, DiscountOption : discountOption, GuestMode});
			});
		});
	});
}

function PatientPaymentRecordGet(PatientID, ID_represents, retrieveLimit, callback) {
	GetPaymentBreakdown.ExecuteQuery(PatientID, ID_represents, retrieveLimit, db_connection, function (paymentDetails) {
		console.log("paymentDetails check",paymentDetails);
		const arr_PaymentIDs = paymentDetails.map(paymentDetail => paymentDetail.PaymentID);
		GetDressingDetails.ExecuteQuery(PatientID, ID_represents, arr_PaymentIDs, db_connection, function (dressingDetails) {
			console.log("dressingDetails check",dressingDetails);
			GetOintmentDetails.ExecuteQuery(PatientID, ID_represents, arr_PaymentIDs, db_connection, function (ointmentDetails) {
				console.log("ointmentDetails check",ointmentDetails);
				GetProductDetails.ExecuteQuery(PatientID, ID_represents, arr_PaymentIDs, db_connection, function (productDetails) {
					console.log("productDetails check",productDetails);
					const PaymentRecords = { PaymentDetails : paymentDetails , DressingDetails : dressingDetails, OintmentDetails : ointmentDetails, ProductDetails : productDetails };
					callback(PaymentRecords);
				});
			});
		});
	});
}

function DBBackupHandler(BackupDBPass, req, res) {
	if(BackupDBPass === WebConfig.db_backup_password) {
		BackupDatabase(function(filepath) {
			if(filepath !== false) {
				res.download(filepath);
			}
		});
	} else {
		res.redirect(req.headers.referer || '/');
	}
}

function BackupDatabase(callback) {
	const current_timestamp = new Date(Date.now() + (5*60*60*1000)).toISOString().slice(0,19).replace(/-/g,"").replace(/:/g,"").replace(/T/g,"");
	
	const db_username = WebConfig.database.user;
	const db_pass = WebConfig.database.password;
	const db_name = WebConfig.database.database;
	const db_backup_folder = "DB_Backup";
	const db_backup_filename = "db_backup_" + current_timestamp + ".sql";
	const db_backup_filepath = db_backup_folder + "\\" + db_backup_filename;

	const mkdir_shell_cmd = "mkdir " + db_backup_folder + "/D";
	const db_backup_shell_cmd = "mysqldump -u " + db_username + " -p" + db_pass + " " + db_name + " --routines --triggers > " + db_backup_filepath;

	console.log(db_backup_shell_cmd);

	exec(mkdir_shell_cmd, (error) => {
		if (error) {
			console.error("mkdir exec error: " + error);
			callback(false);
		}
		exec(db_backup_shell_cmd, (error) => {
			if (error) {
				console.error("mysqldump exec error: " + error);
				callback(false);
			}
			console.log("Backup successful");
			callback(db_backup_filepath);
		});
	});

	// If mysqldump is not recognized as a command, make sure to add 'C:\xampp\mysql\bin' to path (or the path \mysql\bin of wherever mysql is installed).
}

function GetInventoryData(editProductID,editDressingID,callback) {
	GetProductCategories.ExecuteQuery(db_connection,function(categories) {
		console.log(categories.slice(0,5));
		GetDressingPads.ExecuteQuery(db_connection, function(dressing_pads) {
			console.log(dressing_pads);
			GetProducts.ExecuteQuery(db_connection, function(products) {
				console.log(products.slice(0,5));
				GetDiscontinuedProducts.ExecuteQuery(db_connection, function(discontinued_products) {
					const responseValues = { title: "Inventory | Chawla Clinic", Categories:categories, Products:products, DressingPads:dressing_pads, Discontinued_Products:discontinued_products, EditProductID:editProductID, EditDressingID:editDressingID}
					callback(responseValues);
				});
			});
		});
	});
}

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/static", express.static(__dirname + '/static'));
app.use("/static/css", express.static(__dirname + '/static/css'));
app.use("/static/js", express.static(__dirname + '/static/js'));

app.listen(WebConfig.port);

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.redirect('/patient');
});

app.get('/patient', (req, res) => {
	console.log('req query',req.query);
	const searchOption = req.query.searchoption;
	const searchKeyword = req.query.searchkeyword;
	console.log(searchOption);
	console.log(searchKeyword);
	if (searchOption === undefined) {
		res.render('patient', { title: "Patient | Chawla Clinic", searchResult: undefined });
	} else {
		SearchPatient.ExecuteQuery(searchOption, searchKeyword, "patientsearch", db_connection, function (data) {
			res.render('patient', { title: "Patient | Chawla Clinic", searchResult: data });
		});
	}
});

app.post('/patient', (req, res) => {
	console.log('req body',req.body);
	const BackupDBPass = req.body.BackupDBPassInput;
	if(req.body.AddPatient !== undefined) {
		AddPatient.ExecuteQuery(req.body, db_connection, function (PatientID) {
			res.redirect('/patient-details?id=' + PatientID);
		});
	} else if(BackupDBPass !== undefined) {
		DBBackupHandler(BackupDBPass, req, res);
	}
});

app.get('/patient-details', (req, res) => {
	const PatientID = req.query.id;
	var editMode = false;
	if (PatientID == undefined) {
		res.status(404);
		res.render('page-not-found')
	} else {
		SearchPatient.ExecuteQuery("PatientID", PatientID, "patientinfo", db_connection, function (data) {
			console.log(data);
			if (data.length == 1) {
				GetCurrentBalance.ExecuteQuery(PatientID, db_connection, function (bal) {
					var CurrentBalance = bal[0].paid + bal[0].discount - bal[0].total;
					console.log(CurrentBalance);
					PatientPaymentRecordGet(PatientID, "Patient", true, function(PaymentRecords) {
						res.render('patient-details', { title: "Patient Details | Chawla Clinic", PatientDetails: data, EditMode: editMode, Balance: CurrentBalance, ...PaymentRecords});
					});
				});
			} else if (data.length == 0) {
				res.render('patient-details', { title: "Patient Details | Chawla Clinic", PatientDetails: data });
			}
		});
	}
});

app.post('/patient-details', (req, res) => {
	const PatientID = req.query.id;
	const BackupDBPass = req.body.BackupDBPassInput;
	const ReprintPaymentID = req.body.ReprintPayment;
	var editMode = false;
	console.log(req.body);
	if (req.body.editDetails == "edit") {
		editMode = true;
	} else if (req.body.editDetails == "save") {
		UpdatePatient.ExecuteQuery(PatientID, req.body, db_connection);
	} else if (req.body.deposit == "deposit") {
		DepositAmount.ExecuteQuery(PatientID, req.body, db_connection);
	}
	if (PatientID == undefined) {
		res.status(404);
		res.render('page-not-found')
	} else {
		if(BackupDBPass !== undefined) {
			DBBackupHandler(BackupDBPass, req, res);
		} else if(ReprintPaymentID !== undefined) {
			GetPaymentSummary.ExecuteQuery(parseInt(ReprintPaymentID), db_connection, function(result) {
				console.log(result);
				const Payment_HashValue = result[0].PaymentHashCode;
				if(Payment_HashValue === null) {
					res.redirect(req.originalUrl);
				} else {
					const AmountPaid = result[0].AmountPaid;
					const PaymentDate = result[0].Date;
					const PaymentDateObj = new Date(PaymentDate);
					const processedPaymentDate = String(PaymentDateObj.getDate()).padStart(2, '0' ) + "%2F" + String(PaymentDateObj.getMonth() + 1).padStart(2, '0' ) + "%2F" + PaymentDateObj.getFullYear();
					const redirectURL = req.originalUrl;
					console.log("Print Handler Values: ", Payment_HashValue, AmountPaid, processedPaymentDate, redirectURL);
					res.render('print-handler', {printmethod:"printpaymentreceipt", params:"PaymentHashID=" + Payment_HashValue + "&AmountPaid=" + AmountPaid + "&PaymentDate=" + processedPaymentDate, redirectURL});
				}
			});
		} else {
			SearchPatient.ExecuteQuery("PatientID", PatientID, "patientinfo", db_connection, function (data) {
				console.log(data);
				GetCurrentBalance.ExecuteQuery(PatientID, db_connection, function (bal) {
					var CurrentBalance = bal[0].paid + bal[0].discount - bal[0].total;
					console.log(CurrentBalance);
					PatientPaymentRecordGet(PatientID, "Patient", true, function(PaymentRecords) {
						res.render('patient-details', { title: "Patient Details | Chawla Clinic", PatientDetails: data, EditMode: editMode, Balance: CurrentBalance, ...PaymentRecords});
					});
				});
			});
		}
	}
});

app.get('/patient-details/add-payment-record', (req, res) => {
	if(req.query.addID !== undefined) {
		var PatientID = req.query.addID;
		GetDiscountMode.ExecuteQuery(PatientID, db_connection, function(DiscountOption) {
			console.log(DiscountOption);
			const discountOption = DiscountOption[0].DiscountMode;
			AddPaymentRecordCartGet(PatientID,undefined,discountOption,res);
		});
	} else {
		res.status(404);
		res.render('page-not-found');
	}
});

app.post('/patient-details/add-payment-record', (req, res) => {
	console.log(req.body);
	console.log(req.query);
	const BackupDBPass = req.body.BackupDBPassInput;
	var PatientID = req.query.addID;
	if(PatientID !== undefined) {
		GetDiscountMode.ExecuteQuery(PatientID, db_connection, function(DiscountOption) {
			console.log(DiscountOption);
			const discountOption = DiscountOption[0].DiscountMode;
			if (req.body.incrementQuantity !== undefined) {
				console.log("incrementQuantity");
				CartManagement.ExecuteQuery(req.body.incrementQuantity, PatientID, 1, db_connection, function (result) {
					console.log(result);
					AddPaymentRecordCartGet(PatientID,undefined,discountOption,res);
				});
			} else if (req.body.decrementQuantity !== undefined) {
				console.log("decrementQuantity");
				CartManagement.ExecuteQuery(req.body.decrementQuantity, PatientID, -1, db_connection, function (result) {
					console.log(result);
					AddPaymentRecordCartGet(PatientID,undefined,discountOption,res);
				});
			} else if (req.body.ConfirmCartItems !== undefined) {
				console.log("ConfirmCartItems");
				var DiscountAmount = 0;
				if(req.body.DiscountAmount !== undefined) {
					DiscountAmount = req.body.DiscountAmount;
				}
				GetGuestPatient.ExecuteQuery(db_connection, function(guest) {
					var isGuest = false;
					if(guest[0].PatientID === +PatientID) {
						isGuest = true;
					}
					console.log("is guest:", isGuest);
					ConfirmCartItems.ExecuteQuery(PatientID, req.body.PurchaseDate, req.body.AmountPaid, DiscountAmount, discountOption, GetCartList, GetTempDressingRecord, AddPaymentHashCode, isGuest, db_connection, function (PaymentID) {
						if(req.body.GenerateReceipt === "True") {
							GetPaymentSummary.ExecuteQuery(PaymentID, db_connection, function(result) {
								console.log(result);
								const Payment_HashValue = result[0].PaymentHashCode;
								if(Payment_HashValue === null) {
									res.redirect('/patient-details/?id=' + PatientID);
								} else {
									const AmountPaid = result[0].AmountPaid;
									const PaymentDate = result[0].Date;
									const PaymentDateObj = new Date(PaymentDate);
									const processedPaymentDate = String(PaymentDateObj.getDate()).padStart(2, '0' ) + "%2F" + String(PaymentDateObj.getMonth() + 1).padStart(2, '0' ) + "%2F" + PaymentDateObj.getFullYear();
									console.log(Payment_HashValue, AmountPaid, processedPaymentDate);
									const redirectURL = '/patient-details/?id=' + PatientID;
									res.render('print-handler', {printmethod:"printpaymentreceipt", params:"PaymentHashID=" + Payment_HashValue + "&AmountPaid=" + AmountPaid + "&PaymentDate=" + processedPaymentDate, redirectURL});
								}
							});
						} else {
							res.redirect('/patient-details/?id=' + PatientID);
						}
						
					});
				});
			} else if (req.body.prodID !== undefined) {
				console.log("prodID");
				CartManagement.ExecuteQuery(req.body.prodID, PatientID, 1, db_connection, function (result) {
					console.log(result);
					AddPaymentRecordCartGet(PatientID,undefined,discountOption,res);
				});
			} else if (req.body.searchproducts !== undefined) {
				console.log("searchproducts");
				SearchProducts.ExecuteQuery(req.body.searchproducts, db_connection, function (searchResult) {
					console.log(searchResult);
					AddPaymentRecordCartGet(PatientID,searchResult,discountOption,res);
				});
			} else if(req.body.AddTempDressingRecord !== undefined) {
				console.log("AddTempDressingRecord");
				AddTempDressingRecord.ExecuteQuery(req.body, PatientID, GetPadPricing, db_connection, function () {
					AddPaymentRecordCartGet(PatientID,undefined,discountOption,res);
				});
			} 
			else if(req.body.RemoveTempDressingHold !== undefined) {
				console.log("RemoveTempDressingHold");
				if(isNumeric(req.body.RemoveTempDressingHold)) {
					const TempID = parseInt(req.body.RemoveTempDressingHold);
					RemoveTempDressingHold.ExecuteQuery(TempID, db_connection, function () {
						AddPaymentRecordCartGet(PatientID,undefined,discountOption,res);
					});
				} else { AddPaymentRecordCartGet(PatientID,undefined,discountOption,res); }
			}
		});
	}
	if(BackupDBPass !== undefined) {
		DBBackupHandler(BackupDBPass, req, res);
	}
});

app.get('/patient-details/check-payment', (req, res) => {
	console.log(req.query);
	const Payment_HashValue = req.query.id;
	if(Payment_HashValue !== undefined) {
		if(isAlphaNumericLowercase(Payment_HashValue)) {
			GetPaymentIDFromHash.ExecuteQuery(undefined, Payment_HashValue, db_connection, function(result) {
				if(result.length > 0) {
					const PaymentID = result[0].PaymentID;
					PatientPaymentRecordGet(PaymentID, "Payment", false, function(PaymentRecord) {
						res.render('check-payment', { title: "Check Payment Record | Chawla Clinic", ...PaymentRecord, InvalidInput: false});
					});
				} else {
					res.render('check-payment', { title: "Check Payment Record | Chawla Clinic", PaymentDetails: [], InvalidInput: false});
				}
			});
		} else {
			res.render('check-payment', { title: "Check Payment Record | Chawla Clinic", PaymentDetails: undefined, InvalidInput: true});
		}
	}
	else {
		res.render('check-payment', { title: "Check Payment Record | Chawla Clinic", PaymentDetails: undefined, InvalidInput: undefined});
	}
});

app.get('/patient-details/payment-records', (req, res) => {
	const PatientID = req.query.id;
	PatientPaymentRecordGet(PatientID, "Patient", false, function(PaymentRecords) {
		res.render('payment-records', { title: "Payment Records | Chawla Clinic", ...PaymentRecords});
	});
});

app.post('/patient-details/payment-records', (req, res) => {
	console.log(req.body);
	const PatientID = req.query.id;
	const ReprintPaymentID = req.body.ReprintPayment;
	if(ReprintPaymentID !== undefined) {
		GetPaymentSummary.ExecuteQuery(parseInt(ReprintPaymentID), db_connection, function(result) {
			console.log(result);
			const Payment_HashValue = result[0].PaymentHashCode;
			if(Payment_HashValue === null) {
				res.redirect(req.originalUrl);
			} else {
				const AmountPaid = result[0].AmountPaid;
				const PaymentDate = result[0].Date;
				const PaymentDateObj = new Date(PaymentDate);
				const processedPaymentDate = String(PaymentDateObj.getDate()).padStart(2, '0' ) + "%2F" + String(PaymentDateObj.getMonth() + 1).padStart(2, '0' ) + "%2F" + PaymentDateObj.getFullYear();
				const redirectURL = req.originalUrl;
				console.log("Print Handler Values: ", Payment_HashValue, AmountPaid, processedPaymentDate, redirectURL);
				res.render('print-handler', {printmethod:"printpaymentreceipt", params:"PaymentHashID=" + Payment_HashValue + "&AmountPaid=" + AmountPaid + "&PaymentDate=" + processedPaymentDate, redirectURL});
			}
		});
	} else {
		PatientPaymentRecordGet(PatientID, "Patient", false, function(PaymentRecords) {
			res.render('payment-records', { title: "Payment Records | Chawla Clinic", ...PaymentRecords});
		});
	}
});

app.get('/token-generation', (req, res) => {
	console.log(req.query);
	const searchOption = req.query.searchoption;
	const searchKeyword = req.query.searchkeyword;
	if (searchOption === undefined) {
		SQL_GetTokenInfo.ExecuteQuery(undefined, db_connection, function (TokenMaxCounts,MaleDetails,FemaleDetails,ChildDetails) {
			console.log(TokenMaxCounts,MaleDetails,FemaleDetails,ChildDetails);
			res.render('token-generation', { title: "Token Generation | Chawla Clinic", TokenMaxCounts, MaleDetails, FemaleDetails, ChildDetails, searchResult: undefined});
		});
	} else {
		SearchPatient.ExecuteQuery(searchOption, searchKeyword, "token", db_connection, function (data) {
			SQL_GetTokenInfo.ExecuteQuery(undefined, db_connection, function (TokenMaxCounts,MaleDetails,FemaleDetails,ChildDetails) {
				console.log(TokenMaxCounts,MaleDetails,FemaleDetails,ChildDetails);
				res.render('token-generation', { title: "Token Generation | Chawla Clinic", TokenMaxCounts, MaleDetails, FemaleDetails, ChildDetails, searchResult: data});
			});
		});
	}
	
});

app.post('/token-generation', (req, res) => {
	console.log(req.body);
	const BackupDBPass = req.body.BackupDBPassInput;
	const ResetTokenData = req.body.ResetTokenData;
	const ReprintTokenID = req.body.ReprintTokenID;
	const TokenPatientID = req.body.TokenPatientID;
	const TokenName = req.body.TokenName;
	const TokenType = req.body.TokenType;
	const EmergencyPatientToken = req.body.EmergencyPatientToken;

	const currentDateTime = new Date();
	const TokenDateTime = currentDateTime.getFullYear() + "-" + String(currentDateTime.getMonth() + 1).padStart(2, '0') + "-" + String(currentDateTime.getDate()).padStart(2, '0') + " " + String(currentDateTime.getHours()).padStart(2, '0') + ":" + String(currentDateTime.getMinutes()).padStart(2, '0') + ":" + String(currentDateTime.getSeconds()).padStart(2, '0');
  
	if(ResetTokenData === 'true') {
		SQL_ResetTokenData.ExecuteQuery(db_connection, function () {
			res.redirect('token-generation');
		});
	} else if(ReprintTokenID !== undefined) {
		GetTokenInfoByID.ExecuteQuery(ReprintTokenID, db_connection, function(result) {
			const TokenCaseNo = result[0].CaseNo;
			const TokenNumber = result[0].TokenNumber;
			const TokenType = result[0].TokenType;
			const TokenDateTime_unprocessed = result[0].TokenDateTime;
			const TokenDateProcessed = String(TokenDateTime_unprocessed.getDate()).padStart(2, '0') + "/" + String(TokenDateTime_unprocessed.getMonth() + 1).padStart(2, '0') + "/" + TokenDateTime_unprocessed.getFullYear();
			const TokenTimeProcessed = TokenDateTime_unprocessed.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
			const redirectURL = '/token-generation';
			console.log("Print Handler Values: ", TokenCaseNo, TokenNumber, TokenType, TokenDateProcessed, TokenTimeProcessed, redirectURL);
			res.render('print-handler', {printmethod:"printtokennumber", params:"CaseNum=" + TokenCaseNo + "&PatientType=" + TokenType + "&TokenNumber=" + TokenNumber + "&TokenDate=" + TokenDateProcessed + "&TokenTime=" + TokenTimeProcessed, redirectURL});
		});
	} else if((TokenName !== undefined && TokenType !== undefined) || (TokenPatientID !== undefined)) {
		SQL_AddTokenInfo.ExecuteQuery(TokenPatientID, TokenName, TokenType, TokenDateTime, SQL_GetTokenInfo, SearchPatient, db_connection, function (TokenNum, TokenNumType, PatientID, TokenID) {
			GetTokenInfoByID.ExecuteQuery(TokenID, db_connection, function(result) {
				const TokenCaseNo = result[0].CaseNo;
				const TokenNumber = result[0].TokenNumber;
				const TokenType = result[0].TokenType;
				const TokenDateTime_unprocessed = result[0].TokenDateTime;
				const TokenDateProcessed = String(TokenDateTime_unprocessed.getDate()).padStart(2, '0') + "/" + String(TokenDateTime_unprocessed.getMonth() + 1).padStart(2, '0') + "/" + TokenDateTime_unprocessed.getFullYear();
				const TokenTimeProcessed = TokenDateTime_unprocessed.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
				const redirectURL = '/token-generation';
				console.log("Print Handler Values: ", TokenCaseNo, TokenNumber, TokenType, TokenDateProcessed, TokenTimeProcessed, redirectURL);
				res.render('print-handler', {printmethod:"printtokennumber", params:"CaseNum=" + TokenCaseNo + "&PatientType=" + TokenType + "&TokenNumber=" + TokenNumber + "&TokenDate=" + TokenDateProcessed + "&TokenTime=" + TokenTimeProcessed, redirectURL});
			});
		});
	} else if(EmergencyPatientToken !== undefined) {
		var AddPatientData = req.body;
		AddPatientData.type = "B";
		AddPatientData.disease = "";
		AddPatientData.address = "";
		AddPatientData.phonenum = "";

		const currentDate = new Date();
		AddPatientData.firstvisit = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1).toString().padStart(2, '0') + "-" + currentDate.getDate().toString().padStart(2, '0');

		AddPatient.ExecuteQuery(AddPatientData, db_connection, function (PatientID) {
			SQL_AddTokenInfo.ExecuteQuery(PatientID, undefined, undefined, TokenDateTime, SQL_GetTokenInfo, SearchPatient, db_connection, function (TokenNum, TokenNumType, PatientID, TokenID) {
				GetTokenInfoByID.ExecuteQuery(TokenID, db_connection, function(result) {
					const TokenCaseNo = result[0].CaseNo;
					const TokenNumber = result[0].TokenNumber;
					const TokenType = result[0].TokenType;
					const TokenDateTime_unprocessed = result[0].TokenDateTime;
					const TokenDateProcessed = String(TokenDateTime_unprocessed.getDate()).padStart(2, '0') + "/" + String(TokenDateTime_unprocessed.getMonth() + 1).padStart(2, '0') + "/" + TokenDateTime_unprocessed.getFullYear();
					const TokenTimeProcessed = TokenDateTime_unprocessed.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
					const redirectURL = '/token-generation';
					console.log("Print Handler Values: ", TokenCaseNo, TokenNumber, TokenType, TokenDateProcessed, TokenTimeProcessed, redirectURL);
					res.render('print-handler', {printmethod:"printtokennumber", params:"CaseNum=" + TokenCaseNo + "&PatientType=" + TokenType + "&TokenNumber=" + TokenNumber + "&TokenDate=" + TokenDateProcessed + "&TokenTime=" + TokenTimeProcessed, redirectURL});
				});
			});
		});
	} else if(BackupDBPass !== undefined) {
		DBBackupHandler(BackupDBPass, req, res);
	}
});

app.get('/inventory', (req, res) => {
	console.log(req.query);
	GetInventoryData(-1,-1,function(responseValues) {
		res.render('inventory', responseValues);
	});
});

app.post('/inventory', (req, res) => {
	console.log(req.query);
	console.log(req.body);
	const BackupDBPass = req.body.BackupDBPassInput;
	const AddCategoryName = req.body.AddCategoryName;
	const AddProductName = req.body.AddProductName;
	const EditProductID = req.body.EditProduct;
	const SaveProductID = req.body.SaveProduct;
	const EditDressingID = req.body.EditDressingPad;
	const SaveDressingID = req.body.SaveDressingPad;
	const ProductToDiscontinue = req.body.DiscontinueProduct;
	const AvailableProduct = req.body.AvailableProduct;
	if(BackupDBPass !== undefined) {
		DBBackupHandler(BackupDBPass, req, res);
	} else if(AddCategoryName !== undefined) {
		AddProductCategory.ExecuteQuery(AddCategoryName, db_connection, function() {
			GetInventoryData(-1,-1,function(responseValues) {
				res.render('inventory', responseValues);
			});
		});
	} else if(AddProductName !== undefined) {
		AddProduct.ExecuteQuery(req.body, db_connection, function() {
			GetInventoryData(-1,-1,function(responseValues) {
				res.render('inventory', responseValues);
			});
		});
	} else if(EditProductID !== undefined) {
		var editProdID = -1;
		if (/^\d+$/.test(EditProductID)) {
			editProdID = parseInt(EditProductID);
		}
		GetInventoryData(editProdID,-1,function(responseValues) {
			res.render('inventory', responseValues);
		});
	} else if(SaveProductID !== undefined) {
		UpdateProduct.ExecuteQuery(req.body, db_connection, function() {
			GetInventoryData(-1,-1,function(responseValues) {
				res.render('inventory', responseValues);
			});
		});
	} else if(EditDressingID !== undefined) {
		var editDressID = -1;
		if (/^\d+$/.test(EditDressingID)) {
			editDressID = parseInt(EditDressingID);
		}
		GetInventoryData(-1,editDressID,function(responseValues) {
			res.render('inventory', responseValues);
		});
	} else if(SaveDressingID !== undefined) {
		UpdateDressingPad.ExecuteQuery(req.body, db_connection, function() {
			GetInventoryData(-1,-1,function(responseValues) {
				res.render('inventory', responseValues);
			});
		});
	} else if(ProductToDiscontinue !== undefined) {
		AddDiscontinuedProduct.ExecuteQuery(ProductToDiscontinue, db_connection, function() {
			GetInventoryData(-1,-1,function(responseValues) {
				res.render('inventory', responseValues);
			});
		});
	} else if(AvailableProduct !== undefined) {
		RemoveDiscontinuedProduct.ExecuteQuery(AvailableProduct, db_connection, function() {
			GetInventoryData(-1,-1,function(responseValues) {
				res.render('inventory', responseValues);
			});
		});
	}
});

app.get('/account-management', (req, res) => {
	res.redirect('/under-construction');
});

app.get('/under-construction', (req, res) => {
	res.render('underconstruction')
});

app.use(function (req, res) {
	res.status(404);
	res.render('page-not-found');
})

const express = require('express');
const bodyParser = require("body-parser");

const db_connection = require('./models/db_connect');
const { exec } = require('child_process');

const SQL_ConfirmCartItems = require('./models/SQL_ConfirmCartItems');

// const SQL_AddTokenInfo = require('./models/SQL_AddTokenInfo');
// const SQL_GetTokenInfo = require('./models/SQL_GetTokenInfo');
// const SQL_ResetTokenData = require('./models/SQL_ResetTokenData');


const AddPatient = require('./models/AddPatient');
const SearchPatient = require('./models/SearchPatient');
const UpdatePatient = require('./models/UpdatePatient');
const GetDiscountMode = require('./models/GetDiscountMode');

const GetCurrentBalance = require('./models/GetCurrentBalance');
const DepositAmount = require('./models/DepositAmount');

const GetPaymentBreakdown = require('./models/GetPaymentBreakdown');
const GetDressingDetails = require('./models/GetDressingDetails');
const GetOintmentDetails = require('./models/GetOintmentDetails');
const GetProductDetails = require('./models/GetProductDetails');

const GetPadPricing = require('./models/GetPadPricing');

const AddDressingTempRecord = require('./models/AddDressingTempRecord');
const GetTempDressingRecord = require('./models/GetTempDressingRecord');
const RemoveTempDressingHold = require('./models/RemoveTempDressingHold');

const CartManagement = require('./models/CartManagement');
const GetCartList = require('./models/GetCartList');
const SearchProducts = require('./models/SearchProducts');

function AddPaymentRecordCartGet(PatientID,searchResult,discountOption,res) {
	GetCartList.ExecuteQuery(PatientID, db_connection, function (cartInfo, TotalAmount) {
		console.log(cartInfo);
		GetTempDressingRecord.ExecuteQuery(PatientID, db_connection, function(tempDressingResult) {
			var disableField = "disabled";
			var totalAmount = TotalAmount;
			if(tempDressingResult.length == 0) {
				disableField = "";
			} else {
				totalAmount += tempDressingResult[0].TotalAmount;
			}
			console.log(tempDressingResult);
			res.render('add-payment-record', { title: "Add Patient Payment Record | Chawla Clinic", DressingRecord_OnHold: tempDressingResult[0], SearchResult: searchResult, CartItems: cartInfo, TotalAmount: totalAmount, DisableField : disableField, DiscountOption : discountOption});
		});
	});
}

function BackupDatabase() {
	const current_timestamp = new Date(Date.now() + (5*60*60*1000)).toISOString().slice(0,19).replace(/-/g,"").replace(/:/g,"").replace(/T/g,"");
	// console.log(current_timestamp);
	
	const db_username = "root";
	const db_pass = "root";
	const db_name = "chawlaclinic";
	const db_backup_filename = "db_backup_" + current_timestamp + ".sql";
	const shell_cmd = "mysqldump -u " + db_username + " -p" + db_pass + " " + db_name + " --routines --triggers > " + db_backup_filename;
	console.log(shell_cmd);

	exec(shell_cmd, (error) => {
		if (error) {
			console.error("exec error: " + error);
			return;
		}
		console.log("Backup successful");
	});
	return;

	// If mysqldump is not recognized as a command, make sure to add 'C:\xampp\mysql\bin' to path (or the path \mysql\bin of wherever mysql is installed).
}

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/static", express.static(__dirname + '/static'));
app.use("/static/css", express.static(__dirname + '/static/css'));
app.use("/static/js", express.static(__dirname + '/static/js'));

app.listen(3000);

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
	if (searchOption == undefined) {
		res.render('patient', { title: "Patient | Chawla Clinic", searchResult: undefined });
	} else {
		SearchPatient.ExecuteQuery("patientdetails", searchOption, searchKeyword, db_connection, function (data) {
			// console.log(data[0].CaseNo);
			res.render('patient', { title: "Patient | Chawla Clinic", searchResult: data });
		});
	}
});

app.post('/patient', (req, res) => {
	console.log('req body',req.body);
	const BackupDB = req.body.BackupDatabase;
	if(req.body.AddPatient != undefined) {
		AddPatient.ExecuteQuery(req.body, db_connection, function (data) {
			res.redirect('/patient-details?id=' + data.insertId);
			// res.render('patient', {title: "Patient | Chawla Clinic",searchResult:undefined});
		});
	} else if(BackupDB != undefined) {
		BackupDatabase();
		res.redirect('back');
	}
	
});

app.get('/patient-details', (req, res) => {
	const PatientID = req.query.id;
	var editMode = false;
	if (PatientID == undefined) {
		res.status(404);
		res.render('page-not-found')
	} else {
		SearchPatient.ExecuteQuery("patientdetails", "PatientID", PatientID, db_connection, function (data) {
			console.log(data);
			if (data.length == 1) {
				GetCurrentBalance.ExecuteQuery(PatientID, db_connection, function (bal) {
					var CurrentBalance = bal[0].paid + bal[0].discount - bal[0].total;
					console.log(CurrentBalance);
					GetPaymentBreakdown.ExecuteQuery(PatientID, true, db_connection, function (paymentDetails) {
						console.log("check",paymentDetails);
						GetDressingDetails.ExecuteQuery(PatientID, true, db_connection, function (dressingDetails) {
							console.log("check",dressingDetails);
							GetOintmentDetails.ExecuteQuery(PatientID, true, db_connection, function (ointmentDetails) {
								console.log("check",ointmentDetails);
								GetProductDetails.ExecuteQuery(PatientID, true, db_connection, function (productDetails) {
									console.log("check",productDetails);
									res.render('patient-details', { title: "Patient Details | Chawla Clinic", PatientDetails: data, EditMode: editMode, 
																									Balance: CurrentBalance, PaymentDetails : paymentDetails , DressingDetails : dressingDetails,
																									OintmentDetails : ointmentDetails, ProductDetails : productDetails});
								});
							});
						});
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
	const BackupDB = req.body.BackupDatabase;
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
		if(BackupDB != undefined) {
			BackupDatabase();
			res.redirect('back');
		} else {
			SearchPatient.ExecuteQuery("patientdetails", "PatientID", PatientID, db_connection, function (data) {
				console.log(data);
				GetCurrentBalance.ExecuteQuery(PatientID, db_connection, function (bal) {
					var CurrentBalance = bal[0].paid + bal[0].discount - bal[0].total;
					console.log(CurrentBalance);
					GetPaymentBreakdown.ExecuteQuery(PatientID, true, db_connection, function (paymentDetails) {
						console.log("check",paymentDetails);
						GetDressingDetails.ExecuteQuery(PatientID, true, db_connection, function (dressingDetails) {
							console.log("check",dressingDetails);
							GetOintmentDetails.ExecuteQuery(PatientID, true, db_connection, function (ointmentDetails) {
								console.log("check",ointmentDetails);
								GetProductDetails.ExecuteQuery(PatientID, true, db_connection, function (productDetails) {
									console.log("check",productDetails);
									res.render('patient-details', { title: "Patient Details | Chawla Clinic", PatientDetails: data, EditMode: editMode, 
																									Balance: CurrentBalance, PaymentDetails : paymentDetails , DressingDetails : dressingDetails,
																									OintmentDetails : ointmentDetails, ProductDetails : productDetails});
								});
							});
						});
					});
				});
			});
		}
	}
});

app.get('/patient-details/add-payment-record', (req, res) => {
	if(req.query.addID != undefined) {
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
	const BackupDB = req.body.BackupDatabase;
	var PatientID = req.query.addID;
	if(PatientID != undefined) {
		GetDiscountMode.ExecuteQuery(PatientID, db_connection, function(DiscountOption) {
			console.log(DiscountOption);
			const discountOption = DiscountOption[0].DiscountMode;
			if (req.body.incrementQuantity != undefined) {
				console.log("incrementQuantity");
				CartManagement.ExecuteQuery(req.body.incrementQuantity, PatientID, 1, db_connection, function (result) {
					console.log(result);
					AddPaymentRecordCartGet(PatientID,undefined,discountOption,res);
				});
			} else if (req.body.decrementQuantity != undefined) {
				console.log("decrementQuantity");
				CartManagement.ExecuteQuery(req.body.decrementQuantity, PatientID, -1, db_connection, function (result) {
					console.log(result);
					AddPaymentRecordCartGet(PatientID,undefined,discountOption,res);
				});
			} else if (req.body.ConfirmCartItems != undefined) {
				console.log("ConfirmCartItems");
				var DiscountAmount = 0;
				if(req.body.DiscountAmount != undefined) {
					DiscountAmount = req.body.DiscountAmount;
				}
				SQL_ConfirmCartItems.ExecuteQuery(PatientID, req.body.PurchaseDate, req.body.AmountPaid, DiscountAmount, discountOption, GetCartList, GetTempDressingRecord, db_connection, function () {
					res.redirect('/patient-details/?id=' + PatientID);
				});
			} else if (req.body.prodID != undefined) {
				console.log("prodID");
				CartManagement.ExecuteQuery(req.body.prodID, PatientID, 1, db_connection, function (result) {
					console.log(result);
					AddPaymentRecordCartGet(PatientID,undefined,discountOption,res);
				});
			} else if (req.body.searchproducts != undefined) {
				console.log("searchproducts");
				SearchProducts.ExecuteQuery(req.body.searchproducts, db_connection, function (searchResult) {
					console.log(searchResult);
					AddPaymentRecordCartGet(PatientID,searchResult,discountOption,res);
				});
			} else if(req.body.AddTempDressingRecord != undefined) {
				console.log("AddTempDressingRecord");
				AddDressingTempRecord.ExecuteQuery(req.body, PatientID, GetTempDressingRecord, GetPadPricing, db_connection, function (result) {
					if(result === true){
						AddPaymentRecordCartGet(PatientID,undefined,discountOption,res);
					} else {
						res.redirect('/patient-details/add-payment-record/?addID=' + PatientID);
					}
				});
			} else if(req.body.RemoveTempDressingHold != undefined) {
				console.log("RemoveTempDressingHold");
				RemoveTempDressingHold.ExecuteQuery(PatientID, db_connection, function () {
					AddPaymentRecordCartGet(PatientID,undefined,discountOption,res);
				});
			}
		});
	}
	if(BackupDB != undefined) {
		BackupDatabase();
		res.redirect('back');
	}
});

// app.get('/patient-details/add-general-medicine-record', (req,res) => {
//     res.render('add-general-medicine-record', {title: "Add Patient General Medicine Record | Chawla Clinic"});
// });

// app.get('/patient-details/add-products', (req, res) => {
// 	const PatientID = req.query.addID;
// 	GetCartList.ExecuteQuery(PatientID, db_connection, function (cartInfo, TotalAmount) {
// 		console.log(cartInfo);
// 		res.render('add-products', { title: "Add Products | Patient Details | Chawla Clinic", SearchResult: undefined, CartItems: cartInfo, TotalAmount: TotalAmount });
// 	});
// });

// app.post('/patient-details/add-products', (req, res) => {
// 	const PatientID = req.query.addID;
// 	const BackupDB = req.body.BackupDatabase;
// 	console.log(req.body);
// 	console.log(req.query.addID);

// 	if (req.body.incrementQuantity != undefined) {
// 		CartManagement.ExecuteQuery(req.body.incrementQuantity, PatientID, 1, db_connection, function (result) {
// 			console.log(result);
// 			GetCartList.ExecuteQuery(PatientID, db_connection, function (cartInfo, TotalAmount) {
// 				console.log(cartInfo);
// 				res.render('add-products', { title: "Add Products | Patient Details | Chawla Clinic", SearchResult: undefined, CartItems: cartInfo, TotalAmount: TotalAmount });
// 			});
// 		});
// 	} else if (req.body.decrementQuantity != undefined) {
// 		CartManagement.ExecuteQuery(req.body.decrementQuantity, PatientID, -1, db_connection, function (result) {
// 			console.log(result);
// 			GetCartList.ExecuteQuery(PatientID, db_connection, function (cartInfo, TotalAmount) {
// 				console.log(cartInfo);
// 				res.render('add-products', { title: "Add Products | Patient Details | Chawla Clinic", SearchResult: undefined, CartItems: cartInfo, TotalAmount: TotalAmount });
// 			});
// 		});
// 	} else if (req.body.ConfirmCartItems != undefined) {
// 		SQL_ConfirmCartItems.ExecuteQuery(PatientID, req.body.PurchaseDate, db_connection, GetCartList, 0, function () {
// 			res.redirect('/patient-details/?id=' + PatientID);
// 		});
// 	} else if (req.body.prodID != undefined) {
// 		CartManagement.ExecuteQuery(req.body.prodID, PatientID, 1, db_connection, function (result) {
// 			console.log(result);
// 			GetCartList.ExecuteQuery(PatientID, db_connection, function (cartInfo, TotalAmount) {
// 				console.log(cartInfo);
// 				res.render('add-products', { title: "Add Products | Patient Details | Chawla Clinic", SearchResult: undefined, CartItems: cartInfo, TotalAmount: TotalAmount });
// 			});
// 		});
// 	} else if (req.body.searchproducts != undefined) {
// 		SearchProducts.ExecuteQuery(req.body.searchproducts, db_connection, function (searchResult) {
// 			console.log(searchResult);
// 			GetCartList.ExecuteQuery(PatientID, db_connection, function (cartInfo, TotalAmount) {
// 				console.log(cartInfo);
// 				res.render('add-products', { title: "Add Products | Patient Details | Chawla Clinic", SearchResult: searchResult, CartItems: cartInfo, TotalAmount: TotalAmount });
// 			});
// 		});
// 	} else if(BackupDB != undefined) {
// 		BackupDatabase();
// 		res.redirect('back');
// 	}
// });

app.get('/patient-details/add-general-medicine-record', (req, res) => {
	res.redirect('/under-construction');
});

app.get('/patient-details/general-medicine-records', (req, res) => {
	res.redirect('/under-construction');
});
app.get('/patient-details/add-charges', (req, res) => {
	res.redirect('/under-construction');
	// const PatientID = req.query.addID;
	// SQL_GetCartList.ExecuteQuery(PatientID, db_connection, function (cartInfo, TotalAmount) {
	// 	console.log(cartInfo);
	// 	res.render('add-charges', { title: "Add Charges | Patient Details | Chawla Clinic", SearchResult: undefined, CartItems: cartInfo, TotalAmount: TotalAmount });
	// });
});

app.get('/patient-details/payment-records', (req, res) => {
	const PatientID = req.query.id;
	GetPaymentBreakdown.ExecuteQuery(PatientID, false, db_connection, function (paymentDetails) {
		console.log("check",paymentDetails);
		GetDressingDetails.ExecuteQuery(PatientID, false, db_connection, function (dressingDetails) {
			console.log("check",dressingDetails);
			GetOintmentDetails.ExecuteQuery(PatientID, false, db_connection, function (ointmentDetails) {
				console.log("check",ointmentDetails);
				GetProductDetails.ExecuteQuery(PatientID, false, db_connection, function (productDetails) {
					console.log("check",productDetails);
					res.render('payment-records', { title: "Payment Records | Chawla Clinic", PaymentDetails : paymentDetails, 
																					DressingDetails : dressingDetails, OintmentDetails : ointmentDetails, 
																					ProductDetails : productDetails});
				});
			});
		});
	});
});

app.get('/token-generation', (req, res) => {
	res.redirect('/under-construction');
});

// app.get('/token-generation', (req, res) => {
// 	SQL_GetTokenInfo.ExecuteQuery(undefined, db_connection, function (TokenMaxCounts,MaleDetails,FemaleDetails,ChildDetails) {
// 		console.log(TokenMaxCounts,MaleDetails,FemaleDetails,ChildDetails);
// 		res.render('token-generation', { title: "Token Generation | Chawla Clinic", TokenMaxCounts, MaleDetails, FemaleDetails, ChildDetails});
// 	});
// });

// app.post('/token-generation', (req, res) => {
// 	console.log(req.body);
//  const BackupDB = req.body.BackupDatabase;
// 	if(req.body.ResetTokenData == 'true') {
// 		SQL_ResetTokenData.ExecuteQuery(db_connection, function () {
// 			SQL_GetTokenInfo.ExecuteQuery(undefined, db_connection, function (TokenMaxCounts,MaleDetails,FemaleDetails,ChildDetails) {
// 				res.redirect('back');
// 				// res.render('token-generation', { title: "Token Generation | Chawla Clinic", TokenMaxCounts, MaleDetails, FemaleDetails, ChildDetails});
// 			});
// 		});
// 	} else if(req.body.Name != undefined && req.body.Type != undefined && req.body.TokenDateTime != undefined) {
// 		SQL_AddTokenInfo.ExecuteQuery(req.body, SQL_GetTokenInfo, db_connection, function (NewTokenNumber) {
// 			console.log(req.body);
// 			var spawn = require("child_process").spawn;
// 			var process = spawn('java',["-classpath","./Java_src","TokenPrinting",req.body.Type.toUpperCase(),NewTokenNumber,"BCPrinter"]);
// 			process.stdout.on('data',function(data){
// 				console.log(data.toString());
// 			});
// 			SQL_GetTokenInfo.ExecuteQuery(undefined, db_connection, function (TokenMaxCounts,MaleDetails,FemaleDetails,ChildDetails) {
// 				res.redirect('back');
// 				// res.render('token-generation', { title: "Token Generation | Chawla Clinic", TokenMaxCounts, MaleDetails, FemaleDetails, ChildDetails});
// 			});
// 		});
// 	} else if(BackupDB != undefined) {
// 		BackupDatabase();
// 		res.redirect('back');
// 	}
// });

app.get('/inventory', (req, res) => {
	res.redirect('/under-construction');
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
const express = require('express');
const bodyParser = require("body-parser");

const db_connection = require('./models/db_connect');
const { exec } = require('child_process');

const ConfirmCartItems = require('./models/ConfirmCartItems');

// const SQL_AddTokenInfo = require('./models/SQL_AddTokenInfo');
// const SQL_GetTokenInfo = require('./models/SQL_GetTokenInfo');
// const SQL_ResetTokenData = require('./models/SQL_ResetTokenData');


const AddPatient = require('./models/AddPatient');
const SearchPatient = require('./models/SearchPatient');
const UpdatePatient = require('./models/UpdatePatient');
const GetDiscountMode = require('./models/GetDiscountMode');
const GetGuestPatient = require('./models/GetGuestPatient');

const GetCurrentBalance = require('./models/GetCurrentBalance');
const DepositAmount = require('./models/DepositAmount');

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

const isNumeric = str => /^\d+$/.test(str);

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

function PatientPaymentRecordGet(PatientID, retrieveLimit, callback) {
	GetPaymentBreakdown.ExecuteQuery(PatientID, retrieveLimit, db_connection, function (paymentDetails) {
		console.log("paymentDetails check",paymentDetails);
		const arr_PaymentIDs = paymentDetails.map(paymentDetail => paymentDetail.PaymentID);
		GetDressingDetails.ExecuteQuery(PatientID, arr_PaymentIDs, db_connection, function (dressingDetails) {
			console.log("dressingDetails check",dressingDetails);
			GetOintmentDetails.ExecuteQuery(PatientID, arr_PaymentIDs, db_connection, function (ointmentDetails) {
				console.log("ointmentDetails check",ointmentDetails);
				GetProductDetails.ExecuteQuery(PatientID, arr_PaymentIDs, db_connection, function (productDetails) {
					console.log("productDetails check",productDetails);
					const PaymentRecords = { PaymentDetails : paymentDetails , DressingDetails : dressingDetails, OintmentDetails : ointmentDetails, ProductDetails : productDetails };
					callback(PaymentRecords);
				});
			});
		});
	});
}

function BackupDatabase(callback) {
	const current_timestamp = new Date(Date.now() + (5*60*60*1000)).toISOString().slice(0,19).replace(/-/g,"").replace(/:/g,"").replace(/T/g,"");
	// console.log(current_timestamp);
	
	const db_username = "root";
	const db_pass = "root";
	const db_name = "chawlaclinic";
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
		});
	} else if(BackupDB != undefined) {
		BackupDatabase(function(filepath) {
			if(filepath != false) {
				res.download(filepath);
			}
		});
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
					PatientPaymentRecordGet(PatientID, true, function(PaymentRecords) {
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
			BackupDatabase(function(filepath) {
				if(filepath != false) {
					res.download(filepath);
				}
			});
		} else {
			SearchPatient.ExecuteQuery("patientdetails", "PatientID", PatientID, db_connection, function (data) {
				console.log(data);
				GetCurrentBalance.ExecuteQuery(PatientID, db_connection, function (bal) {
					var CurrentBalance = bal[0].paid + bal[0].discount - bal[0].total;
					console.log(CurrentBalance);
					PatientPaymentRecordGet(PatientID, true, function(PaymentRecords) {
						res.render('patient-details', { title: "Patient Details | Chawla Clinic", PatientDetails: data, EditMode: editMode, Balance: CurrentBalance, ...PaymentRecords});
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
				GetGuestPatient.ExecuteQuery(db_connection, function(guest) {
					var isGuest = false;
					if(guest[0].PatientID === +PatientID) {
						isGuest = true;
					}
					console.log("is guest:", isGuest);
					ConfirmCartItems.ExecuteQuery(PatientID, req.body.PurchaseDate, req.body.AmountPaid, DiscountAmount, discountOption, GetCartList, GetTempDressingRecord, isGuest, db_connection, function () {
						res.redirect('/patient-details/?id=' + PatientID);
					});
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
				AddTempDressingRecord.ExecuteQuery(req.body, PatientID, GetPadPricing, db_connection, function () {
					AddPaymentRecordCartGet(PatientID,undefined,discountOption,res);
				});
			} 
			else if(req.body.RemoveTempDressingHold != undefined) {
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
	if(BackupDB != undefined) {
		BackupDatabase(function(filepath) {
			if(filepath != false) {
				res.download(filepath);
			}
		});
	}
});

app.get('/patient-details/add-general-medicine-record', (req, res) => {
	res.redirect('/under-construction');
});

app.get('/patient-details/general-medicine-records', (req, res) => {
	res.redirect('/under-construction');
});
app.get('/patient-details/add-charges', (req, res) => {
	res.redirect('/under-construction');
});

app.get('/patient-details/payment-records', (req, res) => {
	const PatientID = req.query.id;
	PatientPaymentRecordGet(PatientID, false, function(PaymentRecords) {
		res.render('payment-records', { title: "Payment Records | Chawla Clinic", ...PaymentRecords});
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
// 		BackupDatabase(function(filepath) {
// 			if(filepath != false) {
// 				res.download(filepath);
// 			}
// 		});
// 	}
// });

app.get('/inventory', (req, res) => {
	console.log(req.query);
	GetInventoryData(-1,-1,function(responseValues) {
		res.render('inventory', responseValues);
	});
});

app.post('/inventory', (req, res) => {
	console.log(req.query);
	console.log(req.body);
	const BackupDB = req.body.BackupDatabase;
	const AddCategoryName = req.body.AddCategoryName;
	const AddProductName = req.body.AddProductName;
	const EditProductID = req.body.EditProduct;
	const SaveProductID = req.body.SaveProduct;
	const EditDressingID = req.body.EditDressingPad;
	const SaveDressingID = req.body.SaveDressingPad;
	const ProductToDiscontinue = req.body.DiscontinueProduct;
	const AvailableProduct = req.body.AvailableProduct;
	if(BackupDB != undefined) {
		BackupDatabase(function(filepath) {
			if(filepath != false) {
				res.download(filepath);
			}
		});
	} else if(AddCategoryName != undefined) {
		AddProductCategory.ExecuteQuery(AddCategoryName, db_connection, function() {
			GetInventoryData(-1,-1,function(responseValues) {
				res.render('inventory', responseValues);
			});
		});
	} else if(AddProductName != undefined) {
		AddProduct.ExecuteQuery(req.body, db_connection, function() {
			GetInventoryData(-1,-1,function(responseValues) {
				res.render('inventory', responseValues);
			});
		});
	} else if(EditProductID != undefined) {
		GetInventoryData(EditProductID,-1,function(responseValues) {
			res.render('inventory', responseValues);
		});
	} else if(SaveProductID != undefined) {
		UpdateProduct.ExecuteQuery(req.body, db_connection, function() {
			GetInventoryData(-1,-1,function(responseValues) {
				res.render('inventory', responseValues);
			});
		});
	} else if(EditDressingID != undefined) {
		GetInventoryData(-1,EditDressingID,function(responseValues) {
			res.render('inventory', responseValues);
		});
	} else if(SaveDressingID != undefined) {
		UpdateDressingPad.ExecuteQuery(req.body, db_connection, function() {
			GetInventoryData(-1,-1,function(responseValues) {
				res.render('inventory', responseValues);
			});
		});
	} else if(ProductToDiscontinue != undefined) {
		AddDiscontinuedProduct.ExecuteQuery(ProductToDiscontinue, db_connection, function() {
			GetInventoryData(-1,-1,function(responseValues) {
				res.render('inventory', responseValues);
			});
		});
	} else if(AvailableProduct != undefined) {
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
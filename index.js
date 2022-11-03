const express = require('express');
const bodyParser = require("body-parser");

const db_connection = require('./models/db_connect');
const SQL_SearchPatient = require('./models/SQL_SearchPatient');
const SQL_AddPatient = require('./models/SQL_AddPatient');
const SQL_GetPadPricing = require('./models/SQL_GetPadPricing');
const SQL_UpdatePatient = require('./models/SQL_UpdatePatient');
const SQL_GetDiscountMode = require('./models/SQL_GetDiscountMode');
const SQL_AddDressingRecord = require('./models/SQL_AddDressingRecord');
const SQL_GetCurrentBalance = require('./models/SQL_GetCurrentBalance');
const SQL_DepositAmount = require('./models/SQL_DepositAmount');
const SQL_GetDressingDetails = require('./models/SQL_GetDressingDetails');
const SQL_SearchProducts = require('./models/SQL_SearchProducts');
const SQL_CartManagement = require('./models/SQL_CartManagement');
const SQL_GetCartList = require('./models/SQL_GetCartList');
const SQL_ConfirmCartItems = require('./models/SQL_ConfirmCartItems');
const SQL_GetProductsDetails = require('./models/SQL_GetProductsDetails');
const SQL_GetTokenInfo = require('./models/SQL_GetTokenInfo');
const SQL_AddTokenInfo = require('./models/SQL_AddTokenInfo');
const SQL_ResetTokenData = require('./models/SQL_ResetTokenData');
const SQL_AddDressingTempRecord = require('./models/SQL_AddDressingTempRecord');
const SQL_GetTempDressingRecord = require('./models/SQL_GetTempDressingRecord');

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
	const searchOption = req.query.searchoption;
	const searchKeyword = req.query.searchkeyword;
	console.log(searchOption);
	console.log(searchKeyword);
	if (searchOption == undefined) {
		res.render('patient', { title: "Patient | Chawla Clinic", searchResult: undefined });
	} else {
		SQL_SearchPatient.ExecuteQuery("patientdetails", searchOption, searchKeyword, db_connection, function (data) {
			// console.log(data[0].CaseNo);
			res.render('patient', { title: "Patient | Chawla Clinic", searchResult: data });
		});
	}
});

app.post('/patient', (req, res) => {
	console.log(req.body)
	SQL_AddPatient.ExecuteQuery(req.body, db_connection, function (data) {
		res.redirect('/patient-details?id=' + data.insertId);
		// res.render('patient', {title: "Patient | Chawla Clinic",searchResult:undefined});
	});
});

app.get('/patient-details', (req, res) => {
	const PatientID = req.query.id;
	var editMode = false;
	if (PatientID == undefined) {
		res.status(404);
		res.render('page-not-found')
	} else {
		SQL_SearchPatient.ExecuteQuery("patientdetails", "PatientID", PatientID, db_connection, function (data) {
			console.log(data);
			if (data.length == 1) {
				SQL_GetCurrentBalance.ExecuteQuery(PatientID, db_connection, function (bal) {
					var CurrentBalance = bal[0].paid + bal[0].discount - bal[0].total;
					console.log(CurrentBalance);
					SQL_GetProductsDetails.ExecuteQuery(PatientID, true, db_connection, function (prodPurchaseInfo) {
						console.log(prodPurchaseInfo);
						if (data[0].Type == 'B') {
							SQL_GetDressingDetails.ExecuteQuery(PatientID, true, db_connection, function (dressInfo) {
								console.log(dressInfo);
								res.render('patient-details', { title: "Patient Details | Chawla Clinic", PatientDetails: data, EditMode: editMode, Balance: CurrentBalance, ProductsPurchasingInfo: prodPurchaseInfo, DressingInfo: dressInfo });
							});
						} else if (data[0].Type == 'G') {
							res.render('patient-details', { title: "Patient Details | Chawla Clinic", PatientDetails: data, EditMode: editMode, Balance: CurrentBalance, ProductsPurchasingInfo: prodPurchaseInfo });
						}
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
	var editMode = false;
	console.log(req.body);
	if (req.body.editDetails == "edit") {
		editMode = true;
	} else if (req.body.editDetails == "save") {
		SQL_UpdatePatient.ExecuteQuery(PatientID, req.body, db_connection);
	} else if (req.body.deposit == "deposit") {
		SQL_DepositAmount.ExecuteQuery(PatientID, req.body, db_connection);
	}
	if (PatientID == undefined) {
		res.status(404);
		res.render('page-not-found')
	} else {
		SQL_SearchPatient.ExecuteQuery("patientdetails", "PatientID", PatientID, db_connection, function (data) {
			console.log(data);
			SQL_GetCurrentBalance.ExecuteQuery(PatientID, db_connection, function (bal) {
				var CurrentBalance = bal[0].paid + bal[0].discount - bal[0].total;
				console.log(CurrentBalance);
				SQL_GetProductsDetails.ExecuteQuery(PatientID, true, db_connection, function (prodPurchaseInfo) {
					console.log(prodPurchaseInfo);
					if (data[0].Type == 'B') {
						SQL_GetDressingDetails.ExecuteQuery(PatientID, true, db_connection, function (dressInfo) {
							console.log(dressInfo);
							res.render('patient-details', { title: "Patient Details | Chawla Clinic", PatientDetails: data, EditMode: editMode, Balance: CurrentBalance, ProductsPurchasingInfo: prodPurchaseInfo, DressingInfo: dressInfo });
						});
					} else if (data[0].Type == 'G') {
						res.render('patient-details', { title: "Patient Details | Chawla Clinic", PatientDetails: data, EditMode: editMode, Balance: CurrentBalance });
					}
				});
			});
		});
	}
});

app.get('/patient-details/add-dressing-record', (req, res) => {
	res.render('add-dressing-record', { title: "Add Patient Dressing Record | Chawla Clinic", PadQuantity: "", PadFraction: 0, DressingDate: undefined, DressingAmount: undefined, SearchResult: undefined, CartItems: [], TotalAmount: 0});
});

app.post('/patient-details/add-dressing-record', (req, res) => {
	console.log(req.body);
	if (req.body.GetAmount == "true") {
		var padQty = 0;
		if (req.body.padquantity != "") {
			padQty = parseInt(req.body.padquantity);
		}
		var DressingDate = req.body.dressingdate;
		var padFraction = req.body.padfraction;
		SQL_GetPadPricing.ExecuteQuery(padQty, padFraction, db_connection, function (PadData) {
			var DressingAmount = 0;
			for (let i = 0; i < PadData.length; i += 1) {
				console.log(PadData[i]);
				if (PadData[i].ProductName == "Dressing Pad 1") {
					DressingAmount += (PadData[i].ProductPrice * padQty);
				} else if (PadData[i].ProductName.includes(padFraction)) {
					DressingAmount += PadData[i].ProductPrice;
				}
			}
			console.log(DressingAmount);
			SQL_GetDiscountMode.ExecuteQuery(req.query.addID, db_connection, function (DiscMode) {
				res.render('add-dressing-record', { title: "Add Dressing Record | Chawla Clinic", PadQuantity: padQty, PadFraction: padFraction, DressingDate: DressingDate, DressingAmount: DressingAmount, PatientID: req.query.addID, DiscountMode: DiscMode[0].DiscountMode, SearchResult: undefined, CartItems: [], TotalAmount: 0});
			});
		});
	} else if(req.body.dressing_pid != undefined) {
		SQL_AddDressingTempRecord.ExecuteQuery(req.body, SQL_GetTempDressingRecord, db_connection, function (result) {
			SQL_GetTempDressingRecord.ExecuteQuery(req.body.dressing_pid, db_connection, function (result) {
			
				// res.render('add-dressing-record', { title: "Add Dressing Record | Chawla Clinic", PadQuantity: padQty, PadFraction: padFraction, DressingDate: DressingDate, DressingAmount: DressingAmount, PatientID: req.query.addID, DiscountMode: DiscMode[0].DiscountMode, SearchResult: undefined, CartItems: [], TotalAmount: 0});
			});
		});
	} else if (req.body.AddRecord == "true") {
		SQL_AddDressingRecord.ExecuteQuery(req.body, db_connection, function (DiscMode) {
			res.redirect('/patient-details/?id=' + req.body.id);
		});
	}
});

app.get('/patient-details/dressing-records', (req, res) => {
	const PatientID = req.query.id;
	SQL_GetDressingDetails.ExecuteQuery(PatientID, false, db_connection, function (dressInfo) {
		console.log(dressInfo);
		res.render('dressing-records', { title: "Dressing Records | Patient Details | Chawla Clinic", DressingInfo: dressInfo });
	});
});

// app.get('/patient-details/add-general-medicine-record', (req,res) => {
//     res.render('add-general-medicine-record', {title: "Add Patient General Medicine Record | Chawla Clinic"});
// });

app.get('/patient-details/add-products', (req, res) => {
	const PatientID = req.query.addID;
	SQL_GetCartList.ExecuteQuery(PatientID, db_connection, function (cartInfo, TotalAmount) {
		console.log(cartInfo);
		res.render('add-products', { title: "Add Products | Patient Details | Chawla Clinic", SearchResult: undefined, CartItems: cartInfo, TotalAmount: TotalAmount });
	});
});

app.post('/patient-details/add-products', (req, res) => {
	const PatientID = req.query.addID;
	console.log(req.body);
	console.log(req.query.addID);

	if (req.body.incrementQuantity != undefined) {
		SQL_CartManagement.ExecuteQuery(req.body.incrementQuantity, PatientID, 1, db_connection, function (result) {
			console.log(result);
			SQL_GetCartList.ExecuteQuery(PatientID, db_connection, function (cartInfo, TotalAmount) {
				console.log(cartInfo);
				res.render('add-products', { title: "Add Products | Patient Details | Chawla Clinic", SearchResult: undefined, CartItems: cartInfo, TotalAmount: TotalAmount });
			});
		});
	} else if (req.body.decrementQuantity != undefined) {
		SQL_CartManagement.ExecuteQuery(req.body.decrementQuantity, PatientID, -1, db_connection, function (result) {
			console.log(result);
			SQL_GetCartList.ExecuteQuery(PatientID, db_connection, function (cartInfo, TotalAmount) {
				console.log(cartInfo);
				res.render('add-products', { title: "Add Products | Patient Details | Chawla Clinic", SearchResult: undefined, CartItems: cartInfo, TotalAmount: TotalAmount });
			});
		});
	} else if (req.body.ConfirmCartItems != undefined) {
		SQL_ConfirmCartItems.ExecuteQuery(PatientID, req.body.PurchaseDate, db_connection, SQL_GetCartList, function () {
			res.redirect('/patient-details/?id=' + PatientID);
		});
	} else if (req.body.prodID != undefined) {
		SQL_CartManagement.ExecuteQuery(req.body.prodID, PatientID, 1, db_connection, function (result) {
			console.log(result);
			SQL_GetCartList.ExecuteQuery(PatientID, db_connection, function (cartInfo, TotalAmount) {
				console.log(cartInfo);
				res.render('add-products', { title: "Add Products | Patient Details | Chawla Clinic", SearchResult: undefined, CartItems: cartInfo, TotalAmount: TotalAmount });
			});
		});
	} else if (req.body.searchproducts != undefined) {
		SQL_SearchProducts.ExecuteQuery(req.body.searchproducts, db_connection, function (searchResult) {
			console.log(searchResult);
			SQL_GetCartList.ExecuteQuery(PatientID, db_connection, function (cartInfo, TotalAmount) {
				console.log(cartInfo);
				res.render('add-products', { title: "Add Products | Patient Details | Chawla Clinic", SearchResult: searchResult, CartItems: cartInfo, TotalAmount: TotalAmount });
			});
		});
	}
});

app.get('/patient-details/products-purchasing-records', (req, res) => {
	const PatientID = req.query.id;
	SQL_GetProductsDetails.ExecuteQuery(PatientID, false, db_connection, function (prodPurchaseInfo) {
		console.log(prodPurchaseInfo);
		res.render('products-purchasing-records', { title: "Products Purchasing Records | Patient Details | Chawla Clinic", ProductsPurchasingInfo: prodPurchaseInfo });
	});
	// res.redirect('/under-construction');
});

app.get('/patient-details/add-general-medicine-record', (req, res) => {
	res.redirect('/under-construction');
});

app.get('/patient-details/general-medicine-records', (req, res) => {
	res.redirect('/under-construction');
});

app.get('/patient-details/payment-history', (req, res) => {
	res.redirect('/under-construction');
});

app.get('/token-generation', (req, res) => {
	SQL_GetTokenInfo.ExecuteQuery(undefined, db_connection, function (TokenMaxCounts,MaleDetails,FemaleDetails,ChildDetails) {
		console.log(TokenMaxCounts,MaleDetails,FemaleDetails,ChildDetails);
		res.render('token-generation', { title: "Token Generation | Chawla Clinic", TokenMaxCounts, MaleDetails, FemaleDetails, ChildDetails});
	});
});

app.post('/token-generation', (req, res) => {
	console.log(req.body);
	if(req.body.ResetTokenData == 'true') {
		SQL_ResetTokenData.ExecuteQuery(db_connection, function () {
			SQL_GetTokenInfo.ExecuteQuery(undefined, db_connection, function (TokenMaxCounts,MaleDetails,FemaleDetails,ChildDetails) {
				res.redirect('back');
				// res.render('token-generation', { title: "Token Generation | Chawla Clinic", TokenMaxCounts, MaleDetails, FemaleDetails, ChildDetails});
			});
		});
	} else if(req.body.Name != undefined && req.body.Type != undefined && req.body.TokenDateTime != undefined) {
		SQL_AddTokenInfo.ExecuteQuery(req.body, SQL_GetTokenInfo, db_connection, function (NewTokenNumber) {
			console.log(req.body);
			var spawn = require("child_process").spawn;
			var process = spawn('java',["-classpath","./Java_src","TokenPrinting",req.body.Type.toUpperCase(),NewTokenNumber,"BCPrinter"]);
			process.stdout.on('data',function(data){
				console.log(data.toString());
			});
			SQL_GetTokenInfo.ExecuteQuery(undefined, db_connection, function (TokenMaxCounts,MaleDetails,FemaleDetails,ChildDetails) {
				res.redirect('back');
				// res.render('token-generation', { title: "Token Generation | Chawla Clinic", TokenMaxCounts, MaleDetails, FemaleDetails, ChildDetails});
			});
		});
	}
});

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
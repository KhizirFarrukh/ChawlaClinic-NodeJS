const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const db_pool = require('./models/db_connect');

const AddPaymentHashCode = require('./models/AddPaymentHashCode');
const GetPaymentIDFromHash = require('./models/GetPaymentIDFromHash');

const AddTokenInfo = require('./models/AddTokenInfo');
const GetTokenInfo = require('./models/GetTokenInfo');
const GetTokenInfoByID = require('./models/GetTokenInfoByID');
const ResetTokenData = require('./models/ResetTokenData');

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

async function AddPaymentRecordCartGet(PatientID) {
	const [cartInfo, TotalAmount] = await GetCartList.ExecuteQuery(PatientID, db_pool);
	console.log(cartInfo);

	const tempDressingResult = await GetTempDressingRecord.ExecuteQuery(PatientID, db_pool);

	let totalAmount = TotalAmount;
	totalAmount += tempDressingResult.reduce((total, tempDressing) => total + tempDressing.TotalAmount, 0);
	console.log(totalAmount);
	console.log(tempDressingResult);

	const GuestPatient = await GetGuestPatient.ExecuteQuery(db_pool);
	console.log(GuestPatient);

	let GuestMode = false;
	if(+PatientID === GuestPatient[0].PatientID) {
		GuestMode = true;
	}

	const values = {DressingRecord_OnHold: tempDressingResult, CartItems: cartInfo, TotalAmount: totalAmount, GuestMode}
	return values;
}

async function PatientPaymentRecordGet(PatientID, ID_represents, retrieveLimit) {
	const paymentDetails = await GetPaymentBreakdown.ExecuteQuery(PatientID, ID_represents, retrieveLimit, db_pool);
	console.log("paymentDetails check",paymentDetails);

	const arr_PaymentIDs = paymentDetails.map(paymentDetail => paymentDetail.PaymentID);

	const dressingDetails = await GetDressingDetails.ExecuteQuery(PatientID, ID_represents, arr_PaymentIDs, db_pool);
	console.log("dressingDetails check",dressingDetails);
	
	const ointmentDetails = await GetOintmentDetails.ExecuteQuery(PatientID, ID_represents, arr_PaymentIDs, db_pool);
	console.log("ointmentDetails check",ointmentDetails);

	const productDetails = await GetProductDetails.ExecuteQuery(PatientID, ID_represents, arr_PaymentIDs, db_pool);
	console.log("productDetails check",productDetails);

	const PaymentRecords = { PaymentDetails : paymentDetails , DressingDetails : dressingDetails, OintmentDetails : ointmentDetails, ProductDetails : productDetails };
	return PaymentRecords;
}

async function DBBackupHandler(BackupDBPass, req, res) {
	if(BackupDBPass === WebConfig.db_backup_password) {
		const filepath = await BackupDatabase();
		console.log("DB Backup Filepath:", filepath);
		if(filepath !== false) {
			res.download(filepath);
		}
	} else {
		res.redirect(req.headers.referer || '/');
	}
}


async function BackupDatabase() {
  const current_timestamp = new Date(Date.now() + (5*60*60*1000)).toISOString().slice(0,19).replace(/-/g,"").replace(/:/g,"").replace(/T/g,"");
  
  const db_username = WebConfig.database.user;
  const db_pass = WebConfig.database.password;
  const db_name = WebConfig.database.database;
  const db_backup_folder = "DB_Backup";
  const db_backup_filename = "db_backup_" + current_timestamp + ".sql";
  const db_backup_filepath = db_backup_folder + "\\" + db_backup_filename;
  
  // const mkdir_shell_cmd = "mkdir " + db_backup_folder;
  const db_backup_shell_cmd = "mysqldump -u " + db_username + " -p" + db_pass + " " + db_name + " --routines --triggers > " + db_backup_filepath;
  
  console.log(db_backup_shell_cmd);
  
  try {
		if (!fs.existsSync(db_backup_folder)) {
      fs.mkdirSync(db_backup_folder);
    }
    // await exec(mkdir_shell_cmd);
    await exec(db_backup_shell_cmd);
    console.log("Backup successful");
    return db_backup_filepath;
  } catch (error) {
    console.error("exec error: ", error);
    return false;
  }

	// If mysqldump is not recognized as a command, make sure to add 'C:\xampp\mysql\bin' to path (or the path \mysql\bin of wherever mysql is installed).
}

async function GetInventoryData() {
	const categories = await GetProductCategories.ExecuteQuery(db_pool);
	console.log(categories.slice(0,5));

	const dressing_pads = await GetDressingPads.ExecuteQuery(db_pool);
	console.log(dressing_pads);

	const products = await GetProducts.ExecuteQuery(db_pool);
	console.log(products.slice(0,5));

	const discontinued_products = await GetDiscontinuedProducts.ExecuteQuery(db_pool);

	const InventoryData = { Categories:categories, Products:products, DressingPads:dressing_pads, Discontinued_Products:discontinued_products}
	return InventoryData;
}

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/static", express.static(__dirname + '/static'));
app.use("/static/css", express.static(__dirname + '/static/css'));
app.use("/static/js", express.static(__dirname + '/static/js'));

app.listen(WebConfig.port);

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
	res.redirect('/patient');
});

app.get('/patient', async (req, res) => {
	console.log('req query', req.query);
	const searchKeyword = req.query.searchkeyword;
	if (searchKeyword === undefined) {
		res.render('patient', { title: "Patient | Chawla Clinic", searchResult: undefined });
	} else {
		const data = await SearchPatient.ExecuteQuery(searchKeyword, "PatientSearch", db_pool);
		res.render('patient', { title: "Patient | Chawla Clinic", searchResult: data });
	}
});

app.post('/patient', async (req, res) => {
	console.log('req body', req.body);
	const BackupDBPass = req.body.BackupDBPassInput;
	if(req.body.AddPatient !== undefined) {
		const PatientID = await AddPatient.ExecuteQuery(req.body, db_pool);

		res.redirect('/patient-details?id=' + PatientID);
	} else if(BackupDBPass !== undefined) {
		await DBBackupHandler(BackupDBPass, req, res);
	}
});

app.get('/patient-details', async (req, res) => {
	const PatientID = req.query.id;
	let editMode = false;
	if (PatientID === undefined) {
		res.status(404);
		res.render('page-not-found');
	} else {
		const data = await SearchPatient.ExecuteQuery(PatientID, "PatientInfo", db_pool);
		console.log(data);
		if (data.length === 1) {
			const bal = await GetCurrentBalance.ExecuteQuery(PatientID, db_pool);
			console.log(bal);
			const paidBal = (bal[0].paid !== null && typeof bal[0].paid === "string") ? parseInt(bal[0].paid) : 0;
			const discountBal = (bal[0].discount !== null && typeof bal[0].discount === "string") ? parseInt(bal[0].discount) : 0;
			const totalBal = (bal[0].total !== null && typeof bal[0].total === "string") ? parseInt(bal[0].total) : 0;

			let CurrentBalance = paidBal + discountBal - totalBal;
			console.log("Balance:",CurrentBalance);

			const PaymentRecords = await PatientPaymentRecordGet(PatientID, "Patient", true);
			res.render('patient-details', { title: "Patient Details | Chawla Clinic", PatientDetails: data, EditMode: editMode, Balance: CurrentBalance, ...PaymentRecords});
		} else if (data.length === 0) {
			res.render('patient-details', { title: "Patient Details | Chawla Clinic", PatientDetails: data });
		}
	}
});

app.post('/patient-details', async (req, res) => {
	const PatientID = req.query.id;
	const BackupDBPass = req.body.BackupDBPassInput;
	const ReprintPaymentID = req.body.ReprintPayment;

	let editMode = false;
	console.log(req.body);

	if (req.body.editDetails === "edit") {
		editMode = true;
	} else if (req.body.editDetails === "save") {
		await UpdatePatient.ExecuteQuery(PatientID, req.body, db_pool);
	} else if (req.body.deposit === "deposit") {
		await DepositAmount.ExecuteQuery(PatientID, req.body, db_pool);
	}

	if(BackupDBPass !== undefined) {
		await DBBackupHandler(BackupDBPass, req, res);
	} else if (PatientID === undefined) {
		res.status(404);
		res.render('page-not-found');
	} else {
		if(ReprintPaymentID !== undefined) {
			if(!isNaN(ReprintPaymentID)) {
				const PaymentSummary = await GetPaymentSummary.ExecuteQuery(parseInt(ReprintPaymentID), db_pool);
				console.log(PaymentSummary);
				const Payment_HashValue = PaymentSummary[0].PaymentHashCode;
				if(Payment_HashValue === null) {
					res.redirect(req.originalUrl);
				} else {
					const AmountPaid = PaymentSummary[0].AmountPaid;
					const PaymentDate = PaymentSummary[0].Date;
					const PaymentDateObj = new Date(PaymentDate);
					const processedPaymentDate = String(PaymentDateObj.getDate()).padStart(2, '0' ) + "%2F" + String(PaymentDateObj.getMonth() + 1).padStart(2, '0' ) + "%2F" + PaymentDateObj.getFullYear();
					const redirectURL = req.originalUrl;
					console.log("Printer Handler Values: ", Payment_HashValue, AmountPaid, processedPaymentDate, redirectURL);
					res.render('print-handler', {printmethod:"printpaymentreceipt", params:"PaymentHashID=" + Payment_HashValue + "&AmountPaid=" + AmountPaid + "&PaymentDate=" + processedPaymentDate, redirectURL});
				}
			} else {
				res.status(404);
				res.render('page-not-found'); //To be changed to Error 400: Bad Request
			}
		} else {
			res.redirect(req.originalUrl);
		}
	}
});

app.get('/patient-details/add-payment-record', async (req, res) => {
	if(req.query.addID !== undefined) {
		let PatientID = req.query.addID;
		const DiscountOption = await GetDiscountMode.ExecuteQuery(PatientID, db_pool);
		console.log(DiscountOption);
		const discountOption = DiscountOption[0].DiscountMode;
		const PaymentRecordCartDetails = await AddPaymentRecordCartGet(PatientID);
		res.render('add-payment-record', { title: "Add Patient Payment Record | Chawla Clinic", SearchResult: undefined, DiscountOption : discountOption, ...PaymentRecordCartDetails});
	} else {
		res.status(404);
		res.render('page-not-found');
	}
});

app.post('/patient-details/add-payment-record', async (req, res) => {
	console.log(req.body);
	console.log(req.query);
	const BackupDBPass = req.body.BackupDBPassInput;
	const PatientID = req.query.addID;
	if(PatientID !== undefined) {
		const DiscountOption = await GetDiscountMode.ExecuteQuery(PatientID, db_pool);
		console.log(DiscountOption);
		const discountOption = DiscountOption[0].DiscountMode;
		if (req.body.incrementQuantity !== undefined) {
			console.log("incrementQuantity");
			await CartManagement.ExecuteQuery(req.body.incrementQuantity, PatientID, 1, db_pool);
			const PaymentRecordCartDetails = await AddPaymentRecordCartGet(PatientID);
			res.render('add-payment-record', { title: "Add Patient Payment Record | Chawla Clinic", SearchResult: undefined, DiscountOption : discountOption, ...PaymentRecordCartDetails});
		} else if (req.body.decrementQuantity !== undefined) {
			console.log("decrementQuantity");
			await CartManagement.ExecuteQuery(req.body.decrementQuantity, PatientID, -1, db_pool);
			const PaymentRecordCartDetails = await AddPaymentRecordCartGet(PatientID);
			res.render('add-payment-record', { title: "Add Patient Payment Record | Chawla Clinic", SearchResult: undefined, DiscountOption : discountOption, ...PaymentRecordCartDetails});
		} else if (req.body.ConfirmCartItems !== undefined) {
			console.log("ConfirmCartItems");
			
			let DiscountAmount = 0;
			if(req.body.DiscountAmount !== undefined) {
				DiscountAmount = req.body.DiscountAmount;
			}
			
			const guest = await GetGuestPatient.ExecuteQuery(db_pool);
			let isGuest = false;
			if(guest[0].PatientID === +PatientID) {
				isGuest = true;
			}
			console.log("is guest:", isGuest);
			
			const PaymentID = await ConfirmCartItems.ExecuteQuery(PatientID, req.body.PurchaseDate, req.body.AmountPaid, DiscountAmount, discountOption, GetCartList, GetTempDressingRecord, isGuest, db_pool);
			await AddPaymentHashCode.ExecuteQuery(PaymentID, db_pool);

			if(req.body.GenerateReceipt === "True") {
				const PaymentSummary = await GetPaymentSummary.ExecuteQuery(PaymentID, db_pool);
				console.log(PaymentSummary);
				const Payment_HashValue = PaymentSummary[0].PaymentHashCode;
				if(Payment_HashValue === null) {
					res.redirect('/patient-details/?id=' + PatientID);
				} else {
					const AmountPaid = PaymentSummary[0].AmountPaid;
					const PaymentDate = PaymentSummary[0].Date;
					const PaymentDateObj = new Date(PaymentDate);
					const processedPaymentDate = String(PaymentDateObj.getDate()).padStart(2, '0' ) + "/" + String(PaymentDateObj.getMonth() + 1).padStart(2, '0' ) + "/" + PaymentDateObj.getFullYear();
					console.log(Payment_HashValue, AmountPaid, processedPaymentDate);
					
					const redirectURL = '/patient-details/?id=' + PatientID;
					const printParams = "PaymentHashID=" + Payment_HashValue + "&AmountPaid=" + AmountPaid + "&PaymentDate=" + processedPaymentDate;
					res.render('print-handler', {printmethod:"printpaymentreceipt", params:printParams, redirectURL});
				}
			} else {
				res.redirect('/patient-details/?id=' + PatientID);
			}
		} else if (req.body.prodID !== undefined) {
			console.log("prodID");
			await CartManagement.ExecuteQuery(req.body.prodID, PatientID, 1, db_pool);
			const PaymentRecordCartDetails = await AddPaymentRecordCartGet(PatientID);
			res.render('add-payment-record', { title: "Add Patient Payment Record | Chawla Clinic", SearchResult: undefined, DiscountOption : discountOption, ...PaymentRecordCartDetails});
		} else if (req.body.searchproducts !== undefined) {
			console.log("searchproducts");
			const searchResult = await SearchProducts.ExecuteQuery(req.body.searchproducts, db_pool);
			console.log(searchResult);
			const PaymentRecordCartDetails = await AddPaymentRecordCartGet(PatientID);
			res.render('add-payment-record', { title: "Add Patient Payment Record | Chawla Clinic", SearchResult: searchResult, DiscountOption : discountOption, ...PaymentRecordCartDetails});
		} else if(req.body.AddTempDressingRecord !== undefined) {
			console.log("AddTempDressingRecord");
			await AddTempDressingRecord.ExecuteQuery(req.body, PatientID, GetPadPricing, db_pool);
			const PaymentRecordCartDetails = await AddPaymentRecordCartGet(PatientID);
			res.render('add-payment-record', { title: "Add Patient Payment Record | Chawla Clinic", SearchResult: undefined, DiscountOption : discountOption, ...PaymentRecordCartDetails});
		}
		else if(req.body.RemoveTempDressingHold !== undefined) {
			console.log("RemoveTempDressingHold");
			if(isNumeric(req.body.RemoveTempDressingHold)) {
				const TempID = parseInt(req.body.RemoveTempDressingHold);
				await RemoveTempDressingHold.ExecuteQuery(TempID, db_pool);
				const PaymentRecordCartDetails = await AddPaymentRecordCartGet(PatientID);
				res.render('add-payment-record', { title: "Add Patient Payment Record | Chawla Clinic", SearchResult: undefined, DiscountOption : discountOption, ...PaymentRecordCartDetails});
			} else { 
				const PaymentRecordCartDetails = await AddPaymentRecordCartGet(PatientID); 
				res.render('add-payment-record', { title: "Add Patient Payment Record | Chawla Clinic", SearchResult: undefined, DiscountOption : discountOption, ...PaymentRecordCartDetails});
			}
		}
	} else if(BackupDBPass !== undefined) {
		await DBBackupHandler(BackupDBPass, req, res);
	} else {
		res.status(404);
		res.render('page-not-found');
	}
});

app.get('/patient-details/check-payment', async (req, res) => {
	console.log(req.query);
	const Payment_HashValue = req.query.id;
	if(Payment_HashValue !== undefined) {
		if(isAlphaNumericLowercase(Payment_HashValue)) {
			const result = await GetPaymentIDFromHash.ExecuteQuery(undefined, Payment_HashValue, db_pool);
			if(result.length > 0) {
				const PaymentID = result[0].PaymentID;
				const PaymentRecord = await PatientPaymentRecordGet(PaymentID, "Payment", false);
				res.render('check-payment', { title: "Check Payment Record | Chawla Clinic", ...PaymentRecord, InvalidInput: false});
			} else {
				res.render('check-payment', { title: "Check Payment Record | Chawla Clinic", PaymentDetails: [], InvalidInput: false});
			}
		} else {
			res.render('check-payment', { title: "Check Payment Record | Chawla Clinic", PaymentDetails: undefined, InvalidInput: true});
		}
	}
	else {
		res.render('check-payment', { title: "Check Payment Record | Chawla Clinic", PaymentDetails: undefined, InvalidInput: undefined});
	}
});

app.post('/patient-details/check-payment', async (req, res) => {
	console.log(req.body);
	const BackupDBPass = req.body.BackupDBPassInput;
	if(BackupDBPass !== undefined) {
		await DBBackupHandler(BackupDBPass, req, res);
	}
});

app.get('/patient-details/payment-records', async (req, res) => {
	const PatientID = req.query.id;
	const PaymentRecords = await PatientPaymentRecordGet(PatientID, "Patient", false);
	res.render('payment-records', { title: "Payment Records | Chawla Clinic", ...PaymentRecords});
});

app.post('/patient-details/payment-records', async (req, res) => {
	console.log(req.body);
	const PatientID = req.query.id;
	const BackupDBPass = req.body.BackupDBPassInput;
	const ReprintPaymentID = req.body.ReprintPayment;
	if(ReprintPaymentID !== undefined) {
		if(!isNaN(ReprintPaymentID)) {
			const result = await GetPaymentSummary.ExecuteQuery(parseInt(ReprintPaymentID), db_pool);
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
				console.log("Printer Handler Values: ", Payment_HashValue, AmountPaid, processedPaymentDate, redirectURL);
				// const printParams = "PaymentHashID=" + Payment_HashValue + "&AmountPaid=" + AmountPaid + "&PaymentDate=" + processedPaymentDate;
				// 	res.render('print-handler', {printmethod:"printpaymentreceipt", params:printParams, redirectURL});
				res.render('print-handler', {printmethod:"printpaymentreceipt", params:"PaymentHashID=" + Payment_HashValue + "&AmountPaid=" + AmountPaid + "&PaymentDate=" + processedPaymentDate, redirectURL});
			}
		}
	} else if(BackupDBPass !== undefined) {
		await DBBackupHandler(BackupDBPass, req, res);
	} else {
		const PaymentRecords = await PatientPaymentRecordGet(PatientID, "Patient", false);
		res.render('payment-records', { title: "Payment Records | Chawla Clinic", ...PaymentRecords});
	}
});

app.get('/token-generation', async (req, res) => {
	console.log(req.query);
	const searchKeyword = req.query.searchkeyword;
	let SearchResultData = undefined;
	if (searchKeyword !== undefined) {
		SearchResultData = await SearchPatient.ExecuteQuery(searchKeyword, "Token_PatientSearch", db_pool);
	}
	const [TokenMaxCounts,MaleDetails,FemaleDetails,ChildDetails] = await GetTokenInfo.ExecuteQuery(db_pool);
	console.log(TokenMaxCounts,MaleDetails,FemaleDetails,ChildDetails);
	res.render('token-generation', { title: "Token Generation | Chawla Clinic", TokenMaxCounts, MaleDetails, FemaleDetails, ChildDetails, searchResult: SearchResultData});
});

app.post('/token-generation', async (req, res) => {
	console.log(req.body);
	const BackupDBPass = req.body.BackupDBPassInput;
	const ReprintTokenID = req.body.ReprintTokenID;
	const TokenPatientID = req.body.TokenPatientID;
	const TokenName = req.body.TokenName;
	const TokenType = req.body.TokenType;
	const EmergencyPatientToken = req.body.EmergencyPatientToken;

	const currentDateTime = new Date();
	const TokenDateTime = currentDateTime.getFullYear() + "-" + String(currentDateTime.getMonth() + 1).padStart(2, '0') + "-" + String(currentDateTime.getDate()).padStart(2, '0') + " " + String(currentDateTime.getHours()).padStart(2, '0') + ":" + String(currentDateTime.getMinutes()).padStart(2, '0') + ":" + String(currentDateTime.getSeconds()).padStart(2, '0');

	if(req.body.ResetTokenData === 'true') {
		await ResetTokenData.ExecuteQuery(db_pool);
		res.redirect('token-generation');
	} else if(ReprintTokenID !== undefined) {
		const TokenInfo_Result = await GetTokenInfoByID.ExecuteQuery(ReprintTokenID, db_pool);
		const Reprint_TokenCaseNo = TokenInfo_Result[0].CaseNo;
		const Reprint_TokenNumber = TokenInfo_Result[0].TokenNumber;
		const Reprint_TokenType = TokenInfo_Result[0].TokenType;
		const Reprint_TokenDateTime_unprocessed = TokenInfo_Result[0].TokenDateTime;
		const Reprint_TokenDateProcessed = String(Reprint_TokenDateTime_unprocessed.getDate()).padStart(2, '0') + "/" + String(Reprint_TokenDateTime_unprocessed.getMonth() + 1).padStart(2, '0') + "/" + Reprint_TokenDateTime_unprocessed.getFullYear();
		const Reprint_TokenTimeProcessed = Reprint_TokenDateTime_unprocessed.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
		const redirectURL = '/token-generation';
		console.log("Printer Handler Values: ", Reprint_TokenCaseNo, Reprint_TokenNumber, Reprint_TokenType, Reprint_TokenDateProcessed, Reprint_TokenTimeProcessed, redirectURL);
		// const printParams = "PaymentHashID=" + Payment_HashValue + "&AmountPaid=" + AmountPaid + "&PaymentDate=" + processedPaymentDate;
		// res.render('print-handler', {printmethod:"printpaymentreceipt", params:printParams, redirectURL});
		res.render('print-handler', {printmethod:"printtokennumber", params:"CaseNum=" + Reprint_TokenCaseNo + "&PatientType=" + Reprint_TokenType + "&TokenNumber=" + Reprint_TokenNumber + "&TokenDate=" + Reprint_TokenDateProcessed + "&TokenTime=" + Reprint_TokenTimeProcessed, redirectURL});
	} else if((TokenName !== undefined && TokenType !== undefined) || (TokenPatientID !== undefined)) {
		let PatientData = undefined;
		if(TokenPatientID !== undefined) {
			PatientData = await SearchPatient.ExecuteQuery(TokenPatientID, "PatientInfo", db_pool);
		}

		const [TokenNum, TokenNumType, TokenID] = await AddTokenInfo.ExecuteQuery(TokenPatientID, TokenName, TokenType, TokenDateTime, GetTokenInfo, PatientData, db_pool);

		const TokenInfo_Result = await GetTokenInfoByID.ExecuteQuery(TokenID, db_pool);
		console.log(TokenInfo_Result);

		const Reprint_TokenCaseNo = TokenInfo_Result[0].CaseNo;
		const Reprint_TokenNumber = TokenInfo_Result[0].TokenNumber;
		const Reprint_TokenType = TokenInfo_Result[0].TokenType;
		const Reprint_TokenDateTime_unprocessed = TokenInfo_Result[0].TokenDateTime;
		const Reprint_TokenDateProcessed = String(Reprint_TokenDateTime_unprocessed.getDate()).padStart(2, '0') + "/" + String(Reprint_TokenDateTime_unprocessed.getMonth() + 1).padStart(2, '0') + "/" + Reprint_TokenDateTime_unprocessed.getFullYear();
		const Reprint_TokenTimeProcessed = Reprint_TokenDateTime_unprocessed.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
		const redirectURL = '/token-generation';

		console.log("Printer Handler Values: ", Reprint_TokenCaseNo, Reprint_TokenNumber, Reprint_TokenType, Reprint_TokenDateProcessed, Reprint_TokenTimeProcessed, redirectURL);
		// const printParams = "PaymentHashID=" + Payment_HashValue + "&AmountPaid=" + AmountPaid + "&PaymentDate=" + processedPaymentDate;
		// res.render('print-handler', {printmethod:"printpaymentreceipt", params:printParams, redirectURL});
		res.render('print-handler', {printmethod:"printtokennumber", params:"CaseNum=" + Reprint_TokenCaseNo + "&PatientType=" + Reprint_TokenType + "&TokenNumber=" + Reprint_TokenNumber + "&TokenDate=" + Reprint_TokenDateProcessed + "&TokenTime=" + Reprint_TokenTimeProcessed, redirectURL});
	} else if(EmergencyPatientToken !== undefined) {
		let AddPatientData = req.body;
		AddPatientData.type = "B";
		AddPatientData.disease = "";
		AddPatientData.address = "";
		AddPatientData.phonenum = "";

		const currentDate = new Date();
		AddPatientData.firstvisit = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1).toString().padStart(2, '0') + "-" + currentDate.getDate().toString().padStart(2, '0');

		const PatientID = await AddPatient.ExecuteQuery(AddPatientData, db_pool);

		const PatientData = await SearchPatient.ExecuteQuery(PatientID, "PatientInfo", db_pool);
		const [TokenNum, TokenNumType, TokenID] = await AddTokenInfo.ExecuteQuery(PatientID, undefined, undefined, TokenDateTime, GetTokenInfo, PatientData, db_pool);
		const TokenInfo = await GetTokenInfoByID.ExecuteQuery(TokenID, db_pool);
		const TokenCaseNo = TokenInfo[0].CaseNo;
		const TokenNumber = TokenInfo[0].TokenNumber;
		const TokenType = TokenInfo[0].TokenType;
		const TokenDateTime_unprocessed = TokenInfo[0].TokenDateTime;
		const TokenDateProcessed = String(TokenDateTime_unprocessed.getDate()).padStart(2, '0') + "/" + String(TokenDateTime_unprocessed.getMonth() + 1).padStart(2, '0') + "/" + TokenDateTime_unprocessed.getFullYear();
		const TokenTimeProcessed = TokenDateTime_unprocessed.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
		const redirectURL = '/token-generation';
		console.log("Printer Handler Values: ", TokenCaseNo, TokenNumber, TokenType, TokenDateProcessed, TokenTimeProcessed, redirectURL);
		// const printParams = "PaymentHashID=" + Payment_HashValue + "&AmountPaid=" + AmountPaid + "&PaymentDate=" + processedPaymentDate;
		// res.render('print-handler', {printmethod:"printpaymentreceipt", params:printParams, redirectURL});
		res.render('print-handler', {printmethod:"printtokennumber", params:"CaseNum=" + TokenCaseNo + "&PatientType=" + TokenType + "&TokenNumber=" + TokenNumber + "&TokenDate=" + TokenDateProcessed + "&TokenTime=" + TokenTimeProcessed, redirectURL});
	} else if(BackupDBPass !== undefined) {
		await DBBackupHandler(BackupDBPass, req, res);
	}
});

app.get('/inventory', async (req, res) => {
	console.log(req.query);
	
	const InventoryData = await GetInventoryData();
	res.render('inventory', { title: "Inventory | Chawla Clinic", EditProductID:-1, EditDressingID:-1, ...InventoryData});
});

app.post('/inventory', async (req, res) => {
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
		await DBBackupHandler(BackupDBPass, req, res);
	} else if(AddCategoryName !== undefined) {
		await AddProductCategory.ExecuteQuery(AddCategoryName, db_pool);
	} else if(AddProductName !== undefined) {
		await AddProduct.ExecuteQuery(req.body, db_pool);
	} else if(EditProductID !== undefined) {
		let editProdID = -1;
		if (/^\d+$/.test(EditProductID)) {
			editProdID = parseInt(EditProductID);
		}
		const InventoryData = await GetInventoryData();
		res.render('inventory', { title: "Inventory | Chawla Clinic", EditProductID:editProdID, EditDressingID:-1, ...InventoryData});
	} else if(SaveProductID !== undefined) {
		await UpdateProduct.ExecuteQuery(req.body, db_pool);
	} else if(EditDressingID !== undefined) {
		let editDressID = -1;
		if (/^\d+$/.test(EditDressingID)) {
			editDressID = parseInt(EditDressingID);
		}
		const InventoryData = await GetInventoryData();
		res.render('inventory', { title: "Inventory | Chawla Clinic", EditProductID:-1, EditDressingID:editDressID, ...InventoryData});
	} else if(SaveDressingID !== undefined) {
		await UpdateDressingPad.ExecuteQuery(req.body, db_pool);
	} else if(ProductToDiscontinue !== undefined) {
		await AddDiscontinuedProduct.ExecuteQuery(ProductToDiscontinue, db_pool);
	} else if(AvailableProduct !== undefined) {
		await RemoveDiscontinuedProduct.ExecuteQuery(AvailableProduct, db_pool);
	}
	if(BackupDBPass === undefined && EditProductID === undefined && EditDressingID === undefined) {
		res.redirect(req.originalUrl);
	}
});

app.get('/account-management', async (req, res) => {
	res.redirect('/under-construction');
});

app.get('/under-construction', async (req, res) => {
	res.render('underconstruction')
});

app.post('/under-construction', async (req, res) => {
	res.redirect('/under-construction')
});

app.use(function (req, res) {
	res.status(404);
	res.render('page-not-found');
});

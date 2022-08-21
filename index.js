const express = require('express');
const bodyParser = require("body-parser");

const db_connection = require('./models/db_connect');
const SQL_GetTokenInfo = require('./models/SQL_GetTokenInfo');
const SQL_AddTokenInfo = require('./models/SQL_AddTokenInfo');
const SQL_ResetTokenData = require('./models/SQL_ResetTokenData');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/static", express.static(__dirname + '/static'));

app.listen(3000);

app.set('view engine', 'ejs');

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

app.get('/under-construction', (req, res) => {
	res.render('underconstruction')
});
app.use(function (req, res) {
	res.status(404);
	res.render('page-not-found');
})
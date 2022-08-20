// 
// 
//  Merge to index.js (only the java executer code)
// 
// 

const express = require('express');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.listen(3000, ()=>{
  console.log("Server running on port 3000");
});

app.get('/', (req,res) => {
  res.render('index');
});
app.post('/', (req,res) => {
  console.log(req.body);
  var spawn = require("child_process").spawn;
  var process = spawn('java',["test",req.body.PatientType,req.body.TokenNumber,"BCPrinter"]);
  process.stdout.on('data',function(data){
    console.log(data.toString());
  });
  res.render('index');
});
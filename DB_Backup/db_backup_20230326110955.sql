-- MariaDB dump 10.19  Distrib 10.4.22-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: chawlaclinic
-- ------------------------------------------------------
-- Server version	10.4.22-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `discontinuedproducts`
--

DROP TABLE IF EXISTS `discontinuedproducts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `discontinuedproducts` (
  `ProductID` int(11) NOT NULL,
  PRIMARY KEY (`ProductID`),
  CONSTRAINT `discontinuedproducts_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discontinuedproducts`
--

LOCK TABLES `discontinuedproducts` WRITE;
/*!40000 ALTER TABLE `discontinuedproducts` DISABLE KEYS */;
INSERT INTO `discontinuedproducts` VALUES (71),(72),(73),(74),(75),(78),(79),(80),(81);
/*!40000 ALTER TABLE `discontinuedproducts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patientdescriptions`
--

DROP TABLE IF EXISTS `patientdescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patientdescriptions` (
  `PatientID` int(11) NOT NULL,
  `Description` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`PatientID`),
  CONSTRAINT `patientdescriptions_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientdescriptions`
--

LOCK TABLES `patientdescriptions` WRITE;
/*!40000 ALTER TABLE `patientdescriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `patientdescriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patientdetails`
--

DROP TABLE IF EXISTS `patientdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patientdetails` (
  `PatientID` int(11) NOT NULL AUTO_INCREMENT,
  `CaseNo` varchar(10) COLLATE utf8_bin NOT NULL,
  `Type` char(1) COLLATE utf8_bin NOT NULL,
  `PatientName` varchar(200) COLLATE utf8_bin NOT NULL,
  `Age` float NOT NULL,
  `Gender` varchar(1) COLLATE utf8_bin NOT NULL,
  `GuardianName` varchar(200) COLLATE utf8_bin NOT NULL,
  `Disease` varchar(200) COLLATE utf8_bin NOT NULL,
  `Address` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `PhoneNumber` varchar(11) COLLATE utf8_bin DEFAULT NULL,
  `Status` varchar(6) COLLATE utf8_bin NOT NULL DEFAULT 'ACTIVE',
  `FirstVisit` date NOT NULL,
  `DiscountMode` varchar(15) COLLATE utf8_bin NOT NULL DEFAULT 'None',
  PRIMARY KEY (`PatientID`),
  CONSTRAINT `AgeLimitCheck` CHECK (`Age` >= 0.0)
) ENGINE=InnoDB AUTO_INCREMENT=140906 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientdetails`
--

LOCK TABLES `patientdetails` WRITE;
/*!40000 ALTER TABLE `patientdetails` DISABLE KEYS */;
INSERT INTO `patientdetails` VALUES (0,'Guest','X','Guest',0,'X','','','','','ACTIVE','1968-01-01','None'),(140870,'22B-000001','B','Khizir Farrukh Chawla',21.917,'M','Sheikh Muhammad Farrukh Chawla','headache part 2','1-C 5/6 Nazimabad No. 1, Karachi','03223131265','ACTIVE','2022-08-25','None'),(140871,'23B-000001','B','Muhammad Ibrahim Farrukh Chawla',8.667,'M','Sheikh Muhammad Farrukh Chawla','hehe','1-C 5/6 Nazimabad No. 1, Karachi','03212937073','ACTIVE','2023-01-08','Zakat'),(140874,'23B-000002','B','test data',11,'F','test','some testing burn disease','','','ACTIVE','2023-01-13','None'),(140876,'23B-005501','B','Muhammad Abdullah Farrukh Chawla',14.25,'M','Sheikh Muhammad Farrukh Chawla','xD','1-C 5/6 Nazimabad No. 1','03001234567','ACTIVE','2023-01-18','None'),(140877,'23B-005502','B','Ifrah Farrukh Chawla',19.167,'F','Sheikh Muhammad Farrukh Chawla','hehe','1-C 5/6 Nazimabad No. 1','03001212345','ACTIVE','2023-01-18','None'),(140878,'23B-001101','B','Huzaifa Farrukh',23.25,'M','Farrukh Chawla','asdfasf','','','ACTIVE','2023-01-18','None'),(140882,'23B-005503','B','asd',2,'M','','','','','ACTIVE','2023-01-19','None'),(140883,'23B-001102','B','test 2',50,'M','','','','','ACTIVE','2023-01-19','None'),(140884,'23B-011102','B','test 3',10,'M','','','','','ACTIVE','2023-01-19','None'),(140885,'23B-021102','B','test 4',18,'M','','','','','ACTIVE','2023-01-19','None'),(140886,'21B-000001','B','test 5',25,'M','','','','','ACTIVE','2021-01-01','None'),(140887,'21B-000002','B','test 6',32,'M','','','','','ACTIVE','2021-01-01','None'),(140888,'23B-021103','B','some random xD',99.917,'M','almost to a century xDDDD','party edited','','','ACTIVE','2023-01-30','None'),(140889,'23B-021104','B','new',0,'M','','','','','ACTIVE','2023-02-03','None'),(140890,'23B-021105','B','the test xDD',15,'F','','chicken burger addictionssssss','Urdu Bazar, Nazimabad No. 1, Karachi Central, Sindh, Pakistan, Asia, Earth, Milky Way, The Universe','03001122335','ACTIVE','2023-02-16','None'),(140891,'23B-021106','B','emergency token',4,'M','father name','','','','ACTIVE','2023-02-19','None'),(140892,'23B-021107','B','Umer Shaheer Ul Haq Chawla',7.333,'M','Shaheer Ul Haq Chawla','hehehehehehehe xDDDDDDDDDDDD','1-C 5/6 Nazimabad No. 1, Karachi','03001122339','ACTIVE','2023-02-19','None'),(140893,'23B-021108','B','new testing patient',12,'M','asdasdad a','qae ef fe f af','r5423515f43v 3453454353 4- fgeg','03000000000','ACTIVE','2023-02-21','Zakat'),(140894,'23B-021109','B','hehe test 2',11.917,'F','father name','','','','ACTIVE','2023-02-21','None'),(140895,'23B-021110','B','test 3331263165ads',11.917,'M','dstfsdf fa f','','','','ACTIVE','2023-02-21','None'),(140896,'23B-021111','B','test #55132321321',12,'F','saSAsASasdsad','','','','ACTIVE','2023-02-21','None'),(140897,'23B-021112','B','new',40,'M','sd','','','','ACTIVE','2023-02-22','None'),(140898,'23B-001152','B','after transactions new data case no manual',20.417,'F','some new random name','oyiiii huyiiiiiiiiiiiiiiiiii','Shah Latif Town, bhains colony, National Highway, Karachi, Pakistan','03001133559','ACTIVE','2023-03-17','None'),(140899,'23B-011101','B','test patient id undefined',11.667,'M','hehe','','','','ACTIVE','2023-03-17','None'),(140900,'23B-001234','B','data insertion result console log ccheck',2,'M','asd','','','','ACTIVE','2023-03-17','None'),(140901,'23B-011234','B','data insertion result console log ccheck again',1,'M','','','','','ACTIVE','2023-03-17','None'),(140902,'23B-001321','B','patient id on add patient fix check',4,'M','father X','xDDDDDDDDDDDDDDDDDDDDDDDDDDD','karachi','03451122335','ACTIVE','2023-03-17','None'),(140903,'23B-021113','B','auto case no generate test',13,'M','asd','','sdfdsf sdfsdf sdf sdf sdaf sdf sdf sdf sadf sadf sadf sdafwerwefsdfv w4rf34wt fer 345t tf tg45t345t4','','ACTIVE','2023-03-18','None'),(140904,'23B-021114','B','emergency token test',18.417,'M','hehe','','','','ACTIVE','2023-03-19','None'),(140905,'23B-021115','B','emergency patient token print',15.333,'F','asd','','','','ACTIVE','2023-03-25','None');
/*!40000 ALTER TABLE `patientdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patientdressingrecord`
--

DROP TABLE IF EXISTS `patientdressingrecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patientdressingrecord` (
  `DressingID` int(11) NOT NULL AUTO_INCREMENT,
  `PaymentID` int(11) NOT NULL,
  `QtyOfPads` float NOT NULL,
  `TotalAmount` int(11) NOT NULL,
  `DressingDate` date NOT NULL,
  PRIMARY KEY (`DressingID`),
  KEY `PaymentID` (`PaymentID`),
  CONSTRAINT `patientdressingrecord_ibfk_2` FOREIGN KEY (`PaymentID`) REFERENCES `patientpaymentrecord` (`PaymentID`)
) ENGINE=InnoDB AUTO_INCREMENT=1296 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientdressingrecord`
--

LOCK TABLES `patientdressingrecord` WRITE;
/*!40000 ALTER TABLE `patientdressingrecord` DISABLE KEYS */;
INSERT INTO `patientdressingrecord` VALUES (1250,1309,1.25,1000,'2023-01-05'),(1251,1310,1,800,'2023-01-05'),(1252,1314,2.5,2000,'2023-01-08'),(1253,1319,2.25,1800,'2023-01-10'),(1254,1321,2.5,2000,'2023-01-10'),(1255,1322,2.5,2000,'2023-01-09'),(1256,1325,2.5,2000,'2023-01-11'),(1257,1327,2.5,2000,'2023-01-12'),(1259,1329,2.5,2000,'2023-01-13'),(1260,1330,2.25,1800,'2023-01-11'),(1261,1331,2.75,2200,'2023-01-11'),(1262,1332,1,800,'2023-01-13'),(1263,1336,1.5,1200,'2023-01-27'),(1264,1336,1.25,1000,'2023-01-28'),(1265,1336,1.25,1000,'2023-01-29'),(1266,1336,1.25,1000,'2023-01-30'),(1267,1338,1,800,'2023-01-31'),(1268,1339,4.75,3800,'2023-01-30'),(1269,1346,0.75,700,'2023-02-01'),(1270,1349,0.75,700,'2023-02-02'),(1271,1350,0.5,600,'2023-02-03'),(1272,1359,5,4000,'2023-02-03'),(1273,1360,3.75,3000,'2023-02-03'),(1274,1361,2.5,2000,'2023-02-12'),(1275,1364,4.75,3800,'2023-02-16'),(1276,1365,4.5,3600,'2023-02-17'),(1277,1365,4.5,3600,'2023-02-18'),(1278,1366,2.25,1800,'2023-02-20'),(1279,1367,1.75,1750,'2023-02-21'),(1280,1369,1.5,1200,'2023-02-22'),(1281,1369,1.5,1200,'2023-02-23'),(1282,1369,1.5,1000,'2023-02-24'),(1283,1371,2.25,2020,'2023-02-21'),(1284,1371,2.5,2250,'2023-02-25'),(1285,1373,1.25,1000,'2023-02-27'),(1286,1373,1.25,1000,'2023-02-28'),(1287,1378,2.25,2000,'2023-03-18'),(1288,1379,2,1600,'2023-03-19'),(1289,1380,2,1600,'2023-03-20'),(1290,1381,2,1600,'2023-03-21'),(1291,1386,2.5,2000,'2023-03-19'),(1292,1394,2.25,2000,'2023-03-24'),(1293,1394,2.25,1800,'2023-03-25'),(1294,1394,2.25,1800,'2023-03-26'),(1295,1394,2.25,1800,'2023-03-27');
/*!40000 ALTER TABLE `patientdressingrecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patientdressingtemphold`
--

DROP TABLE IF EXISTS `patientdressingtemphold`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patientdressingtemphold` (
  `TempID` int(11) NOT NULL AUTO_INCREMENT,
  `PatientID` int(11) NOT NULL,
  `DressingDate` date NOT NULL,
  `QtyOfPads` float NOT NULL,
  `TotalAmount` int(11) NOT NULL,
  PRIMARY KEY (`TempID`),
  CONSTRAINT `patientdressingtemphold_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientdressingtemphold`
--

LOCK TABLES `patientdressingtemphold` WRITE;
/*!40000 ALTER TABLE `patientdressingtemphold` DISABLE KEYS */;
/*!40000 ALTER TABLE `patientdressingtemphold` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patientgeneralmedicinerecord`
--

DROP TABLE IF EXISTS `patientgeneralmedicinerecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patientgeneralmedicinerecord` (
  `MedicineID` int(11) NOT NULL AUTO_INCREMENT,
  `PatientID` int(11) NOT NULL,
  `PaymentID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `PurchaseAmount` int(11) NOT NULL,
  PRIMARY KEY (`MedicineID`),
  KEY `PatientID` (`PatientID`),
  KEY `PaymentID` (`PaymentID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `patientgeneralmedicinerecord_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`),
  CONSTRAINT `patientgeneralmedicinerecord_ibfk_2` FOREIGN KEY (`PaymentID`) REFERENCES `patientpaymentrecord` (`PaymentID`),
  CONSTRAINT `patientgeneralmedicinerecord_ibfk_3` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientgeneralmedicinerecord`
--

LOCK TABLES `patientgeneralmedicinerecord` WRITE;
/*!40000 ALTER TABLE `patientgeneralmedicinerecord` DISABLE KEYS */;
/*!40000 ALTER TABLE `patientgeneralmedicinerecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `patientointmentpurchased`
--

DROP TABLE IF EXISTS `patientointmentpurchased`;
/*!50001 DROP VIEW IF EXISTS `patientointmentpurchased`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `patientointmentpurchased` (
  `PurchaseID` tinyint NOT NULL,
  `ProductID` tinyint NOT NULL,
  `Quantity` tinyint NOT NULL,
  `Amount` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `patientotherprodspurchased`
--

DROP TABLE IF EXISTS `patientotherprodspurchased`;
/*!50001 DROP VIEW IF EXISTS `patientotherprodspurchased`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `patientotherprodspurchased` (
  `PurchaseID` tinyint NOT NULL,
  `ProductID` tinyint NOT NULL,
  `Quantity` tinyint NOT NULL,
  `Amount` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `patientpaymentrecord`
--

DROP TABLE IF EXISTS `patientpaymentrecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patientpaymentrecord` (
  `PaymentID` int(11) NOT NULL AUTO_INCREMENT,
  `PatientID` int(11) NOT NULL,
  `TotalAmount` int(11) NOT NULL,
  `AmountPaid` int(11) NOT NULL,
  `AmountReduction` int(11) NOT NULL,
  `Date` date NOT NULL,
  PRIMARY KEY (`PaymentID`),
  KEY `PatientID` (`PatientID`),
  CONSTRAINT `patientpaymentrecord_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`)
) ENGINE=InnoDB AUTO_INCREMENT=1395 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientpaymentrecord`
--

LOCK TABLES `patientpaymentrecord` WRITE;
/*!40000 ALTER TABLE `patientpaymentrecord` DISABLE KEYS */;
INSERT INTO `patientpaymentrecord` VALUES (1308,140870,1900,1900,0,'2023-01-01'),(1309,140870,2300,2000,0,'2023-01-05'),(1310,140870,800,1000,0,'2023-01-05'),(1311,140870,700,700,0,'2023-01-06'),(1312,140870,0,100,0,'2023-01-07'),(1313,140870,0,1000,0,'2023-01-07'),(1314,140871,2000,2000,0,'2023-01-08'),(1319,140870,5550,4550,0,'2023-01-10'),(1321,140871,2000,2000,0,'2023-01-10'),(1322,140871,2000,1500,500,'2023-01-09'),(1325,140871,2000,1500,500,'2023-01-10'),(1327,140871,2000,1500,500,'2023-01-10'),(1329,140871,2000,1500,500,'2023-01-10'),(1330,140870,1800,1800,0,'2023-01-10'),(1331,140870,6650,7000,0,'2023-01-11'),(1332,140870,800,1000,0,'2023-01-13'),(1333,0,1810,1810,0,'2023-01-18'),(1334,0,430,430,0,'2023-01-18'),(1335,140870,0,-550,0,'2023-01-19'),(1336,140870,7120,7200,0,'2023-01-27'),(1338,140870,800,720,0,'2023-01-31'),(1339,140888,4400,4000,0,'2023-01-30'),(1340,140888,0,400,0,'2023-01-31'),(1343,140870,600,600,0,'2023-01-31'),(1344,140870,1200,1200,0,'2023-01-30'),(1345,140870,1100,1100,0,'2023-01-29'),(1346,140870,700,700,0,'2023-02-01'),(1348,140870,600,600,0,'2023-02-02'),(1349,140870,700,700,0,'2023-02-02'),(1350,140870,600,600,0,'2023-02-03'),(1355,140870,430,430,0,'2023-02-03'),(1357,140870,600,600,0,'2023-02-03'),(1358,140870,850,850,0,'2023-02-03'),(1359,140889,4000,4000,0,'2023-02-03'),(1360,140888,7610,7700,0,'2023-02-03'),(1361,140870,2000,2000,0,'2023-02-12'),(1362,0,1100,1100,0,'2023-02-16'),(1363,140890,0,25000,0,'2023-02-16'),(1364,140890,3800,0,0,'2023-02-16'),(1365,140890,8950,1050,0,'2023-02-16'),(1366,140870,1800,1800,0,'2023-02-21'),(1367,140870,1750,1750,0,'2023-02-21'),(1368,0,1300,1300,0,'2023-02-21'),(1369,140870,7600,8000,0,'2023-02-21'),(1370,0,1680,1680,0,'2023-02-21'),(1371,140870,4270,4000,0,'2023-02-22'),(1372,140870,0,-130,0,'2023-02-22'),(1373,140870,2000,2000,0,'2023-02-22'),(1374,0,3000,3000,0,'2023-02-22'),(1375,140902,0,5000,0,'2023-03-17'),(1378,140902,2000,2000,0,'2023-03-18'),(1379,140902,1600,1600,0,'2023-03-18'),(1380,140902,1600,1600,0,'2023-03-18'),(1381,140902,1600,1600,0,'2023-03-20'),(1383,0,250,250,0,'2023-03-18'),(1384,0,1650,1650,0,'2023-03-18'),(1385,140870,1300,1300,0,'2023-03-18'),(1386,140893,2000,1500,500,'2023-03-19'),(1387,140870,0,500,0,'2023-03-23'),(1388,140870,0,5000,0,'2023-03-23'),(1389,140870,0,100,0,'2023-03-23'),(1390,140870,0,150,0,'2023-03-23'),(1391,140870,0,150,0,'2023-03-23'),(1392,140870,0,100,0,'2023-03-24'),(1393,140870,0,500,0,'2023-03-24'),(1394,140870,8850,2350,0,'2023-03-25');
/*!40000 ALTER TABLE `patientpaymentrecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patientpaymentsidentifiers`
--

DROP TABLE IF EXISTS `patientpaymentsidentifiers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patientpaymentsidentifiers` (
  `PaymentID` int(11) NOT NULL,
  `PaymentHashCode` varchar(10) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`PaymentID`),
  CONSTRAINT `patientpaymentsidentifiers_ibfk_1` FOREIGN KEY (`PaymentID`) REFERENCES `patientpaymentrecord` (`PaymentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientpaymentsidentifiers`
--

LOCK TABLES `patientpaymentsidentifiers` WRITE;
/*!40000 ALTER TABLE `patientpaymentsidentifiers` DISABLE KEYS */;
INSERT INTO `patientpaymentsidentifiers` VALUES (1358,'11qs6q'),(1359,'11r9ns'),(1360,'11svht'),(1361,'11tdgv'),(1362,'11u5dg'),(1364,'11w5ra'),(1365,'11x1lc'),(1366,'11y6cv'),(1367,'11zctr'),(1368,'120vf9'),(1369,'121zud'),(1370,'1226qr'),(1371,'123z8g'),(1373,'125ia4'),(1374,'126dfx'),(1381,'12dedk'),(1383,'12f3dk'),(1384,'12gzyq'),(1385,'12h0vo'),(1386,'12iyc5'),(1394,'12q74m');
/*!40000 ALTER TABLE `patientpaymentsidentifiers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patientproductscart`
--

DROP TABLE IF EXISTS `patientproductscart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patientproductscart` (
  `ProductID` int(11) NOT NULL,
  `PatientID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  PRIMARY KEY (`ProductID`,`PatientID`),
  KEY `PatientID` (`PatientID`),
  CONSTRAINT `patientproductscart_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`),
  CONSTRAINT `patientproductscart_ibfk_2` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientproductscart`
--

LOCK TABLES `patientproductscart` WRITE;
/*!40000 ALTER TABLE `patientproductscart` DISABLE KEYS */;
/*!40000 ALTER TABLE `patientproductscart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patientproductspurchased`
--

DROP TABLE IF EXISTS `patientproductspurchased`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patientproductspurchased` (
  `PurchaseID` int(11) NOT NULL AUTO_INCREMENT,
  `PaymentID` int(11) NOT NULL,
  `TotalAmount` int(11) NOT NULL,
  PRIMARY KEY (`PurchaseID`),
  KEY `PaymentID` (`PaymentID`),
  CONSTRAINT `patientproductspurchased_ibfk_2` FOREIGN KEY (`PaymentID`) REFERENCES `patientpaymentrecord` (`PaymentID`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientproductspurchased`
--

LOCK TABLES `patientproductspurchased` WRITE;
/*!40000 ALTER TABLE `patientproductspurchased` DISABLE KEYS */;
INSERT INTO `patientproductspurchased` VALUES (40,1308,1900),(41,1309,1300),(42,1311,700),(47,1319,3750),(49,1331,4450),(50,1333,1810),(51,1334,430),(52,1336,2920),(53,1339,600),(54,1343,600),(55,1344,1200),(56,1345,1100),(57,1348,600),(58,1355,430),(59,1357,600),(60,1358,850),(61,1360,4610),(62,1362,1100),(63,1365,1750),(64,1368,1300),(65,1369,4200),(66,1370,1680),(67,1374,3000),(68,1383,250),(69,1384,1650),(70,1385,1300),(71,1394,1450);
/*!40000 ALTER TABLE `patientproductspurchased` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patientproductspurchaseditems`
--

DROP TABLE IF EXISTS `patientproductspurchaseditems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patientproductspurchaseditems` (
  `PurchaseID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `Amount` int(11) NOT NULL,
  PRIMARY KEY (`PurchaseID`,`ProductID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `patientproductspurchaseditems_ibfk_1` FOREIGN KEY (`PurchaseID`) REFERENCES `patientproductspurchased` (`PurchaseID`),
  CONSTRAINT `patientproductspurchaseditems_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientproductspurchaseditems`
--

LOCK TABLES `patientproductspurchaseditems` WRITE;
/*!40000 ALTER TABLE `patientproductspurchaseditems` DISABLE KEYS */;
INSERT INTO `patientproductspurchaseditems` VALUES (40,8,2,1200),(40,10,1,700),(41,8,1,600),(41,10,1,700),(42,39,2,700),(47,8,1,600),(47,10,3,2100),(47,39,3,1050),(49,8,2,1200),(49,45,3,750),(49,48,1,600),(49,59,2,1900),(50,8,1,600),(50,39,1,350),(50,55,2,860),(51,40,1,430),(52,8,2,1200),(52,40,4,1720),(53,8,1,600),(54,8,1,600),(55,8,2,1200),(56,8,1,600),(56,45,2,500),(57,8,1,600),(58,40,1,430),(59,8,1,600),(60,66,1,850),(61,10,3,2100),(61,40,1,430),(61,56,2,1500),(61,60,1,580),(62,58,2,1100),(63,10,1,700),(63,45,1,250),(63,64,1,800),(64,9,2,1300),(65,10,2,1400),(65,39,2,700),(65,62,1,2100),(66,58,2,1100),(66,60,1,580),(67,10,2,1400),(67,39,3,1050),(67,58,1,550),(68,45,1,250),(69,10,1,700),(69,45,2,500),(69,63,1,450),(70,9,2,1300),(71,8,2,1200),(71,45,1,250);
/*!40000 ALTER TABLE `patientproductspurchaseditems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patienttokenlogs`
--

DROP TABLE IF EXISTS `patienttokenlogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patienttokenlogs` (
  `PatientID` int(11) DEFAULT NULL,
  `TokenNumber` int(11) NOT NULL,
  `PatientName` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `TokenType` varchar(6) COLLATE utf8_bin NOT NULL,
  `TokenDateTime` datetime NOT NULL,
  KEY `PatientID` (`PatientID`),
  CONSTRAINT `patienttokenlogs_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patienttokenlogs`
--

LOCK TABLES `patienttokenlogs` WRITE;
/*!40000 ALTER TABLE `patienttokenlogs` DISABLE KEYS */;
INSERT INTO `patienttokenlogs` VALUES (NULL,1,'asd','Male','2022-08-20 16:32:46'),(NULL,1,'srytuj','Female','2022-08-20 16:33:15'),(NULL,1,'asd','Female','2022-08-20 16:35:30'),(NULL,1,'asdasdasdasd sad asd as fasf sad asd','Male','2022-08-20 16:37:13'),(NULL,2,'brorojasoda ospidj','Male','2022-08-20 16:37:56'),(NULL,1,'asd','Male','2022-08-21 10:58:04'),(NULL,1,'fdsfsddsf','Female','2022-08-21 10:58:55'),(NULL,2,'asdasd','Male','2022-08-21 11:00:09'),(NULL,1,'sadasdasd','Child','2022-08-21 11:00:54'),(NULL,3,'asdasd','Male','2022-08-21 11:02:59'),(NULL,4,'sadasd','Male','2022-08-21 11:03:29'),(NULL,5,'asdasdasdasdasd','Male','2022-08-21 11:05:56'),(NULL,6,'asdasd','Male','2022-08-21 11:08:19'),(NULL,7,'sadasdasdasd','Male','2022-08-21 11:08:39'),(NULL,2,'sadasd','Female','2022-08-21 11:09:40'),(NULL,2,'gfsdfhsfghrs','Child','2022-08-21 11:16:32'),(NULL,3,'asdasd','Child','2022-08-21 11:17:45'),(NULL,1,'asd','Male','2023-02-03 15:10:52'),(NULL,1,'asdqw','Child','2023-02-03 15:10:56'),(NULL,2,'asdasd','Male','2023-02-03 15:10:59'),(NULL,1,'aadfwe','Female','2023-02-03 15:11:03'),(NULL,2,'xzc awfdwq','Female','2023-02-03 15:11:07'),(NULL,2,'asd 32 fsd fa','Child','2023-02-03 15:11:10'),(NULL,3,'asdasdawdasd as dsa dasd ','Male','2023-02-04 10:18:22'),(NULL,4,'d asdasd wdwd ad asd ad wdqw ','Male','2023-02-04 10:18:30'),(NULL,3,' dad F gergsdf gsd wesf sdf sDF sdf f','Female','2023-02-04 10:18:39'),(NULL,3,' sfd fwefsd ff wef dsfaf arfefq','Child','2023-02-04 10:18:45'),(140877,4,'Ifrah Farrukh Chawla','Female','2023-02-04 10:39:24'),(140877,5,'Ifrah Farrukh Chawla','Female','2023-02-04 10:39:30'),(140889,4,'new','Child','2023-02-04 10:43:22'),(140870,5,'Khizir Farrukh Chawla','Male','2023-02-04 11:45:37'),(140878,6,'Huzaifa Farrukh','Male','2023-02-04 11:47:10'),(NULL,5,'sad','Child','2023-02-04 11:49:09'),(NULL,7,'asdad asda sdas','Male','2023-02-04 11:49:25'),(NULL,5,'as dad asd  asdasd aa','Female','2023-02-04 11:49:37'),(140883,8,'test 2','Male','2023-02-04 11:58:22'),(NULL,9,'aasdasdass new','Male','2023-02-04 11:59:12'),(NULL,10,'new','Male','2023-02-04 12:00:32'),(NULL,6,'vbnm,','Child','2023-02-05 18:53:14'),(140876,11,'Muhammad Abdullah Farrukh Chawla','Male','2023-02-05 18:53:35'),(NULL,12,'asd','Male','2023-02-14 19:56:47'),(NULL,7,'chicken burger','Child','2023-02-14 19:57:13'),(NULL,6,'wsefsdf','Female','2023-02-14 19:58:16'),(NULL,13,'asdasdasdasd   asas','Male','2023-02-14 20:00:30'),(140874,8,'test data','Child','2023-02-14 20:00:52'),(140888,14,'some random xD','Male','2023-02-14 20:16:47'),(140882,8,'asd','Child','2023-02-15 18:04:06'),(140876,1,'Muhammad Abdullah Farrukh Chawla','Male','2023-02-16 15:25:56'),(NULL,1,'e vwserg','Female','2023-02-16 15:26:40'),(140891,1,'emergency token','Child','0000-00-00 00:00:00'),(140885,2,'test 4','Male','2023-02-19 22:00:37'),(140892,1,'emergency token','Child','2023-02-19 22:04:06'),(140870,3,'Khizir Farrukh Chawla','Male','2023-02-21 21:31:38'),(NULL,4,'asdasd','Male','2023-02-21 21:38:17'),(NULL,2,'sad f afaf af sa','Female','2023-02-21 21:38:34'),(NULL,2,'sad asda dwad sada','Child','2023-02-21 21:38:47'),(140893,5,'new testing patient','Male','2023-02-21 21:46:17'),(140894,3,'hehe test 2','Child','2023-02-21 21:47:56'),(140895,4,'test 3331263165ads','Child','2023-02-21 21:48:18'),(140896,3,'test #55132321321','Female','2023-02-21 21:48:40'),(140878,6,'Huzaifa Farrukh','Male','2023-02-21 21:49:06'),(NULL,5,'xddd','Child','2023-02-22 21:26:14'),(140871,6,'Muhammad Ibrahim Farrukh Chawla','Child','2023-02-22 21:26:39'),(140897,7,'new','Male','2023-02-22 21:27:03'),(0,4,'test patient no data enter','Female','2023-03-19 09:19:39'),(0,5,'test patient no data enter PID check','Female','2023-03-19 10:25:27'),(NULL,4,'test patient no data enter','Female','2023-03-19 10:27:53'),(140877,5,'Ifrah Farrukh Chawla','Female','2023-03-19 10:38:34'),(140903,8,'auto case no generate test','Male','2023-03-19 10:40:15'),(140898,6,'after transactions new data case no manual','Female','2023-03-19 10:40:45'),(140901,7,'data insertion result console log ccheck again','Child','2023-03-19 10:41:02'),(140904,9,'emergency token test','Male','2023-03-19 10:41:52'),(NULL,10,'test patient token print','Male','2023-03-25 11:21:25'),(140888,11,'some random xD','Male','2023-03-25 11:21:40'),(140891,8,'emergency token','Child','2023-03-25 11:22:03'),(140905,7,'emergency patient token print','Female','2023-03-25 11:22:50');
/*!40000 ALTER TABLE `patienttokenlogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patienttokennumbers`
--

DROP TABLE IF EXISTS `patienttokennumbers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patienttokennumbers` (
  `TokenID` int(11) NOT NULL AUTO_INCREMENT,
  `TokenNumber` int(11) NOT NULL,
  `TokenType` varchar(6) COLLATE utf8_bin NOT NULL,
  `PatientID` int(11) DEFAULT NULL,
  `PatientName` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `TokenDateTime` datetime NOT NULL,
  PRIMARY KEY (`TokenID`),
  KEY `PatientID` (`PatientID`),
  CONSTRAINT `patienttokennumbers_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patienttokennumbers`
--

LOCK TABLES `patienttokennumbers` WRITE;
/*!40000 ALTER TABLE `patienttokennumbers` DISABLE KEYS */;
INSERT INTO `patienttokennumbers` VALUES (31,1,'Male',140876,'Muhammad Abdullah Farrukh Chawla','2023-02-16 15:25:56'),(32,1,'Female',NULL,'e vwserg','2023-02-16 15:26:40'),(34,2,'Male',140885,'test 4','2023-02-19 22:00:37'),(35,1,'Child',140892,'emergency token','2023-02-19 22:04:06'),(36,3,'Male',140870,'Khizir Farrukh Chawla','2023-02-21 21:31:38'),(37,4,'Male',NULL,'asdasd','2023-02-21 21:38:17'),(38,2,'Female',NULL,'sad f afaf af sa','2023-02-21 21:38:34'),(39,2,'Child',NULL,'sad asda dwad sada','2023-02-21 21:38:47'),(40,5,'Male',140893,'new testing patient','2023-02-21 21:46:17'),(41,3,'Child',140894,'hehe test 2','2023-02-21 21:47:56'),(42,4,'Child',140895,'test 3331263165ads','2023-02-21 21:48:18'),(43,3,'Female',140896,'test #55132321321','2023-02-21 21:48:40'),(44,6,'Male',140878,'Huzaifa Farrukh','2023-02-21 21:49:06'),(45,5,'Child',NULL,'xddd','2023-02-22 21:26:14'),(46,6,'Child',140871,'Muhammad Ibrahim Farrukh Chawla','2023-02-22 21:26:39'),(47,7,'Male',140897,'new','2023-02-22 21:27:03'),(50,4,'Female',NULL,'test patient no data enter','2023-03-19 10:27:53'),(51,5,'Female',140877,'Ifrah Farrukh Chawla','2023-03-19 10:38:34'),(52,8,'Male',140903,'auto case no generate test','2023-03-19 10:40:15'),(53,6,'Female',140898,'after transactions new data case no manual','2023-03-19 10:40:45'),(54,7,'Child',140901,'data insertion result console log ccheck again','2023-03-19 10:41:02'),(55,9,'Male',140904,'emergency token test','2023-03-19 10:41:52'),(56,10,'Male',NULL,'test patient token print','2023-03-25 11:21:25'),(57,11,'Male',140888,'some random xD','2023-03-25 11:21:40'),(58,8,'Child',140891,'emergency token','2023-03-25 11:22:03'),(59,7,'Female',140905,'emergency patient token print','2023-03-25 11:22:50');
/*!40000 ALTER TABLE `patienttokennumbers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paymentdiscounts`
--

DROP TABLE IF EXISTS `paymentdiscounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paymentdiscounts` (
  `PaymentID` int(11) NOT NULL,
  `DiscountOption` varchar(15) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`PaymentID`),
  CONSTRAINT `paymentdiscounts_ibfk_1` FOREIGN KEY (`PaymentID`) REFERENCES `patientpaymentrecord` (`PaymentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paymentdiscounts`
--

LOCK TABLES `paymentdiscounts` WRITE;
/*!40000 ALTER TABLE `paymentdiscounts` DISABLE KEYS */;
INSERT INTO `paymentdiscounts` VALUES (1322,'Zakat'),(1325,'Zakat'),(1327,'Zakat'),(1329,'Zakat'),(1386,'Zakat');
/*!40000 ALTER TABLE `paymentdiscounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productcategory`
--

DROP TABLE IF EXISTS `productcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productcategory` (
  `CategoryID` int(11) NOT NULL AUTO_INCREMENT,
  `CategoryName` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`CategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productcategory`
--

LOCK TABLES `productcategory` WRITE;
/*!40000 ALTER TABLE `productcategory` DISABLE KEYS */;
INSERT INTO `productcategory` VALUES (1,'Dressing Pad'),(2,'Ointment'),(3,'Syrup'),(4,'Capsule'),(5,'Tablet'),(6,'Oil'),(7,'Soap'),(8,'Drops'),(9,'Honey'),(13,'category test after transactions'),(14,'product category add test'),(15,'add category no post'),(16,'add category no post 2'),(17,'add category no post 3');
/*!40000 ALTER TABLE `productcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productinventory`
--

DROP TABLE IF EXISTS `productinventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productinventory` (
  `ProductID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `LastUpdated` date NOT NULL,
  PRIMARY KEY (`ProductID`),
  CONSTRAINT `productinventory_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`),
  CONSTRAINT `QtyPositiveCheck` CHECK (`Quantity` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productinventory`
--

LOCK TABLES `productinventory` WRITE;
/*!40000 ALTER TABLE `productinventory` DISABLE KEYS */;
INSERT INTO `productinventory` VALUES (8,100,'2022-11-03'),(9,100,'2022-11-03'),(10,100,'2023-03-26'),(11,100,'2022-11-03'),(12,100,'2022-11-03'),(13,100,'2022-11-03'),(39,100,'2023-01-06'),(40,100,'2023-01-11'),(41,100,'2023-01-11'),(42,100,'2023-01-11'),(43,100,'2023-01-11'),(44,100,'2023-01-11'),(45,100,'2023-01-11'),(46,100,'2023-01-11'),(47,100,'2023-03-26'),(48,100,'2023-03-26'),(49,100,'2023-01-11'),(50,100,'2023-01-11'),(51,100,'2023-01-11'),(52,100,'2023-01-11'),(53,100,'2023-02-22'),(54,100,'2023-01-11'),(55,100,'2023-01-11'),(56,100,'2023-01-11'),(57,100,'2023-03-26'),(58,100,'2023-01-11'),(59,100,'2023-01-11'),(60,100,'2023-01-11'),(61,100,'2023-01-11'),(62,100,'2023-01-11'),(63,100,'2023-01-11'),(64,100,'2023-01-11'),(65,100,'2023-01-11'),(66,100,'2023-03-26'),(67,100,'2023-01-15'),(68,100,'2023-01-11'),(70,100,'2023-01-14'),(71,100,'2023-01-15'),(72,100,'2023-02-16'),(73,500,'2023-02-22'),(74,500000,'2023-03-18'),(75,11,'2023-03-18'),(78,50,'2023-03-26'),(79,2,'2023-03-24'),(80,3,'2023-03-24'),(81,30,'2023-03-24');
/*!40000 ALTER TABLE `productinventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `ProductID` int(11) NOT NULL AUTO_INCREMENT,
  `ProductName` varchar(150) COLLATE utf8_bin NOT NULL,
  `ProductCategoryID` int(11) NOT NULL,
  `ProductPrice` int(11) NOT NULL,
  `LastUpdated` date NOT NULL,
  PRIMARY KEY (`ProductID`),
  KEY `ProductCategoryID` (`ProductCategoryID`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`ProductCategoryID`) REFERENCES `productcategory` (`CategoryID`),
  CONSTRAINT `PricePositiveCheck` CHECK (`ProductPrice` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Dressing Pad 1/4 below 1',1,550,'2023-03-26'),(2,'Dressing Pad 1/2 below 1',1,600,'2023-03-26'),(3,'Dressing Pad 3/4 below 1',1,700,'2023-03-26'),(4,'Dressing Pad 1',1,800,'2023-02-21'),(5,'Dressing Pad 1/4 above 1',1,200,'2023-02-21'),(6,'Dressing Pad 1/2 above 1',1,400,'2023-02-21'),(7,'Dressing Pad 3/4 above 1',1,600,'2023-02-21'),(8,'Burnaid',2,600,'2022-11-03'),(9,'Burnaid Plus',2,650,'2022-11-03'),(10,'Burnaid Plus AC',2,700,'2023-03-26'),(11,'Sulfur Ointment',2,700,'2022-11-03'),(12,'Lotion',2,600,'2022-11-03'),(13,'Vaseline',2,500,'2022-11-03'),(39,'Saeed Ghani Sandal Soap',7,350,'2023-01-06'),(40,'Box Soap',7,430,'2023-01-11'),(41,'James Acne Soap',7,280,'2023-01-11'),(42,'James Acne Spots Soap',7,280,'2023-01-11'),(43,'Sulphur Soap',7,470,'2023-01-11'),(44,'Neem Plus Soap',7,250,'2023-01-11'),(45,'Goat Milk Soap',7,250,'2023-01-11'),(46,'Ilham Soap',7,280,'2023-01-11'),(47,'Rice Soap',7,660,'2023-03-26'),(48,'Zia Oil',6,600,'2023-03-26'),(49,'Dr. Silin Hair Ampules Oil',6,400,'2023-01-11'),(50,'Super Sonic Drops',8,1300,'2023-01-11'),(51,'Formula 99 Drops',8,1300,'2023-01-11'),(52,'Salajeet Drops',8,800,'2023-01-11'),(53,'D-Fit Ampules Drops',8,550,'2023-02-22'),(54,'Paloosa Honey 250g',9,250,'2023-01-11'),(55,'Paloosa Honey 500g',9,430,'2023-01-11'),(56,'Paloosa Honey 1kg',9,750,'2023-01-11'),(57,'Malta Honey 250g',9,320,'2023-03-26'),(58,'Malta Honey 500g',9,550,'2023-01-11'),(59,'Malta Honey 1kg',9,950,'2023-01-11'),(60,'Beri Honey 250g',9,580,'2023-01-11'),(61,'Beri Honey 500g',9,1100,'2023-01-11'),(62,'Beri Honey 1kg',9,2100,'2023-01-11'),(63,'Ajwain Honey 250g',9,450,'2023-01-11'),(64,'Ajwain Honey 500g',9,800,'2023-01-11'),(65,'Ajwain Honey 1kg',9,1400,'2023-01-11'),(66,'Ajwah Paste Honey 850g',9,850,'2023-03-26'),(67,'Baby Honey Bee Honey',9,1000,'2023-01-15'),(68,'Royal Jelly Honey',9,500,'2023-01-11'),(70,'Super Sonic Syrup',3,1000,'2023-01-14'),(71,'test update',2,500,'2023-01-15'),(72,'test 2',8,6500,'2023-02-16'),(73,'new test product',9,123450,'2023-02-22'),(74,'product test after transactionssss',2,1000000,'2023-03-18'),(75,'category tester product xDDD',13,15,'2023-03-18'),(78,'add product test',3,500,'2023-03-26'),(79,'add product no post',15,200,'2023-03-24'),(80,'add product no post 2',16,300,'2023-03-24'),(81,'add product no post 3',17,500,'2023-03-24');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'chawlaclinic'
--

--
-- Final view structure for view `patientointmentpurchased`
--

/*!50001 DROP TABLE IF EXISTS `patientointmentpurchased`*/;
/*!50001 DROP VIEW IF EXISTS `patientointmentpurchased`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `patientointmentpurchased` AS select `pppi`.`PurchaseID` AS `PurchaseID`,`pppi`.`ProductID` AS `ProductID`,`pppi`.`Quantity` AS `Quantity`,`pppi`.`Amount` AS `Amount` from ((`patientproductspurchaseditems` `pppi` join `products` `p` on(`pppi`.`ProductID` = `p`.`ProductID`)) join `productcategory` `pc` on(`p`.`ProductCategoryID` = `pc`.`CategoryID`)) where `pc`.`CategoryName` = 'Ointment' */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `patientotherprodspurchased`
--

/*!50001 DROP TABLE IF EXISTS `patientotherprodspurchased`*/;
/*!50001 DROP VIEW IF EXISTS `patientotherprodspurchased`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `patientotherprodspurchased` AS select `prodpurchaseitems`.`PurchaseID` AS `PurchaseID`,`prodpurchaseitems`.`ProductID` AS `ProductID`,`prodpurchaseitems`.`Quantity` AS `Quantity`,`prodpurchaseitems`.`Amount` AS `Amount` from ((`patientproductspurchaseditems` `prodpurchaseitems` join `products` `prods` on(`prodpurchaseitems`.`ProductID` = `prods`.`ProductID`)) join `productcategory` `categ` on(`prods`.`ProductCategoryID` = `categ`.`CategoryID`)) where `categ`.`CategoryName` <> 'Ointment' and `categ`.`CategoryName` <> 'Dressing Pad' */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-03-26 11:09:56

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
INSERT INTO `discontinuedproducts` VALUES (66);
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
  `Balance` int(11) NOT NULL,
  `DiscountMode` varchar(15) COLLATE utf8_bin NOT NULL DEFAULT 'None',
  PRIMARY KEY (`PatientID`),
  CONSTRAINT `CaseNoDigitCheck` CHECK (`CaseNo` >= 1 and `CaseNo` <= 9999),
  CONSTRAINT `AgeLimitCheck` CHECK (`Age` >= 0.0)
) ENGINE=InnoDB AUTO_INCREMENT=140875 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientdetails`
--

LOCK TABLES `patientdetails` WRITE;
/*!40000 ALTER TABLE `patientdetails` DISABLE KEYS */;
INSERT INTO `patientdetails` VALUES (140870,'22B-000001','B','Khizir Farrukh Chawla',21.917,'M','Sheikh Muhammad Farrukh Chawla','headache part 2','1-C 5/6 Nazimabad No. 1, Karachi','03223131265','ACTIVE','2022-08-25',0,'None'),(140871,'23B-000001','B','Muhammad Ibrahim Farrukh Chawla',8.667,'M','Sheikh Muhammad Farrukh Chawla','hehe','1-C 5/6 Nazimabad No. 1, Karachi','03212937073','ACTIVE','2023-01-08',0,'Zakat'),(140874,'23B-000002','B','test data',11,'F','test','some testing burn disease','','','ACTIVE','2023-01-13',0,'None');
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
) ENGINE=InnoDB AUTO_INCREMENT=1263 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientdressingrecord`
--

LOCK TABLES `patientdressingrecord` WRITE;
/*!40000 ALTER TABLE `patientdressingrecord` DISABLE KEYS */;
INSERT INTO `patientdressingrecord` VALUES (1250,1309,1.25,1000,'2023-01-05'),(1251,1310,1,800,'2023-01-05'),(1252,1314,2.5,2000,'2023-01-08'),(1253,1319,2.25,1800,'2023-01-10'),(1254,1321,2.5,2000,'2023-01-10'),(1255,1322,2.5,2000,'2023-01-09'),(1256,1325,2.5,2000,'2023-01-11'),(1257,1327,2.5,2000,'2023-01-12'),(1259,1329,2.5,2000,'2023-01-13'),(1260,1330,2.25,1800,'2023-01-11'),(1261,1331,2.75,2200,'2023-01-11'),(1262,1332,1,800,'2023-01-13');
/*!40000 ALTER TABLE `patientdressingrecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patientdressingtemphold`
--

DROP TABLE IF EXISTS `patientdressingtemphold`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patientdressingtemphold` (
  `PatientID` int(11) NOT NULL,
  `DressingDate` date NOT NULL,
  `QtyOfPads` float NOT NULL,
  `TotalAmount` int(11) NOT NULL,
  PRIMARY KEY (`PatientID`),
  CONSTRAINT `patientdressingtemphold_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
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
) ENGINE=InnoDB AUTO_INCREMENT=1333 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientpaymentrecord`
--

LOCK TABLES `patientpaymentrecord` WRITE;
/*!40000 ALTER TABLE `patientpaymentrecord` DISABLE KEYS */;
INSERT INTO `patientpaymentrecord` VALUES (1308,140870,1900,1900,0,'2023-01-01'),(1309,140870,2300,2000,0,'2023-01-05'),(1310,140870,800,1000,0,'2023-01-05'),(1311,140870,700,700,0,'2023-01-06'),(1312,140870,0,100,0,'2023-01-07'),(1313,140870,0,1000,0,'2023-01-07'),(1314,140871,2000,2000,0,'2023-01-08'),(1319,140870,5550,4550,0,'2023-01-10'),(1321,140871,2000,2000,0,'2023-01-10'),(1322,140871,2000,1500,500,'2023-01-09'),(1325,140871,2000,1500,500,'2023-01-10'),(1327,140871,2000,1500,500,'2023-01-10'),(1329,140871,2000,1500,500,'2023-01-10'),(1330,140870,1800,1800,0,'2023-01-10'),(1331,140870,6650,7000,0,'2023-01-11'),(1332,140870,800,1000,0,'2023-01-13');
/*!40000 ALTER TABLE `patientpaymentrecord` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientproductspurchased`
--

LOCK TABLES `patientproductspurchased` WRITE;
/*!40000 ALTER TABLE `patientproductspurchased` DISABLE KEYS */;
INSERT INTO `patientproductspurchased` VALUES (40,1308,1900),(41,1309,1300),(42,1311,700),(47,1319,3750),(49,1331,4450);
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
INSERT INTO `patientproductspurchaseditems` VALUES (40,8,2,1200),(40,10,1,700),(41,8,1,600),(41,10,1,700),(42,39,2,700),(47,8,1,600),(47,10,3,2100),(47,39,3,1050),(49,8,2,1200),(49,45,3,750),(49,48,1,600),(49,59,2,1900);
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
  `PatientName` varchar(200) COLLATE utf8_bin NOT NULL,
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
INSERT INTO `patienttokenlogs` VALUES (NULL,1,'asd','Male','2022-08-20 16:32:46'),(NULL,1,'srytuj','Female','2022-08-20 16:33:15'),(NULL,1,'asd','Female','2022-08-20 16:35:30'),(NULL,1,'asdasdasdasd sad asd as fasf sad asd','Male','2022-08-20 16:37:13'),(NULL,2,'brorojasoda ospidj','Male','2022-08-20 16:37:56'),(NULL,1,'asd','Male','2022-08-21 10:58:04'),(NULL,1,'fdsfsddsf','Female','2022-08-21 10:58:55'),(NULL,2,'asdasd','Male','2022-08-21 11:00:09'),(NULL,1,'sadasdasd','Child','2022-08-21 11:00:54'),(NULL,3,'asdasd','Male','2022-08-21 11:02:59'),(NULL,4,'sadasd','Male','2022-08-21 11:03:29'),(NULL,5,'asdasdasdasdasd','Male','2022-08-21 11:05:56'),(NULL,6,'asdasd','Male','2022-08-21 11:08:19'),(NULL,7,'sadasdasdasd','Male','2022-08-21 11:08:39'),(NULL,2,'sadasd','Female','2022-08-21 11:09:40'),(NULL,2,'gfsdfhsfghrs','Child','2022-08-21 11:16:32'),(NULL,3,'asdasd','Child','2022-08-21 11:17:45');
/*!40000 ALTER TABLE `patienttokenlogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patienttokennumbers`
--

DROP TABLE IF EXISTS `patienttokennumbers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patienttokennumbers` (
  `TokenNumber` int(11) NOT NULL,
  `TokenType` varchar(6) COLLATE utf8_bin NOT NULL,
  `PatientName` varchar(200) COLLATE utf8_bin NOT NULL,
  `TokenDateTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patienttokennumbers`
--

LOCK TABLES `patienttokennumbers` WRITE;
/*!40000 ALTER TABLE `patienttokennumbers` DISABLE KEYS */;
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
INSERT INTO `paymentdiscounts` VALUES (1322,'Zakat'),(1325,'Zakat'),(1327,'Zakat'),(1329,'Zakat');
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productcategory`
--

LOCK TABLES `productcategory` WRITE;
/*!40000 ALTER TABLE `productcategory` DISABLE KEYS */;
INSERT INTO `productcategory` VALUES (1,'Dressing Pad'),(2,'Ointment'),(3,'Syrup'),(4,'Capsule'),(5,'Tablet'),(6,'Oil'),(7,'Soap'),(8,'Drops'),(9,'Honey');
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
INSERT INTO `productinventory` VALUES (8,100,'2022-11-03'),(9,100,'2022-11-03'),(10,100,'2022-11-03'),(11,100,'2022-11-03'),(12,100,'2022-11-03'),(13,100,'2022-11-03'),(39,100,'2023-01-06'),(40,100,'2023-01-11'),(41,100,'2023-01-11'),(42,100,'2023-01-11'),(43,100,'2023-01-11'),(44,100,'2023-01-11'),(45,100,'2023-01-11'),(46,100,'2023-01-11'),(47,100,'2023-01-11'),(48,100,'2023-01-11'),(49,100,'2023-01-11'),(50,100,'2023-01-11'),(51,100,'2023-01-11'),(52,100,'2023-01-11'),(53,100,'2023-01-11'),(54,100,'2023-01-11'),(55,100,'2023-01-11'),(56,100,'2023-01-11'),(57,100,'2023-01-11'),(58,100,'2023-01-11'),(59,100,'2023-01-11'),(60,100,'2023-01-11'),(61,100,'2023-01-11'),(62,100,'2023-01-11'),(63,100,'2023-01-11'),(64,100,'2023-01-11'),(65,100,'2023-01-11'),(66,100,'2023-01-17'),(67,100,'2023-01-15'),(68,100,'2023-01-11'),(70,100,'2023-01-14'),(71,100,'2023-01-15');
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
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Dressing Pad 1/4 below 1',1,500,'2023-01-17'),(2,'Dressing Pad 1/2 below 1',1,600,'2022-09-18'),(3,'Dressing Pad 3/4 below 1',1,700,'2022-09-18'),(4,'Dressing Pad 1',1,800,'2022-09-18'),(5,'Dressing Pad 1/4 above 1',1,200,'2022-09-18'),(6,'Dressing Pad 1/2 above 1',1,400,'2022-09-18'),(7,'Dressing Pad 3/4 above 1',1,600,'2022-09-18'),(8,'Burnaid',2,600,'2022-11-03'),(9,'Burnaid Plus',2,650,'2022-11-03'),(10,'Burnaid Plus AC',2,700,'2022-11-03'),(11,'Sulfur Ointment',2,700,'2022-11-03'),(12,'Lotion',2,600,'2022-11-03'),(13,'Vaseline',2,500,'2022-11-03'),(39,'Saeed Ghani Sandal Soap',7,350,'2023-01-06'),(40,'Box Soap',7,430,'2023-01-11'),(41,'James Acne Soap',7,280,'2023-01-11'),(42,'James Acne Spots Soap',7,280,'2023-01-11'),(43,'Sulphur Soap',7,470,'2023-01-11'),(44,'Neem Plus Soap',7,250,'2023-01-11'),(45,'Goat Milk Soap',7,250,'2023-01-11'),(46,'Ilham Soap',7,280,'2023-01-11'),(47,'Rice Soap',7,660,'2023-01-11'),(48,'Zia Oil',6,600,'2023-01-11'),(49,'Dr. Silin Hair Ampules Oil',6,400,'2023-01-11'),(50,'Super Sonic Drops',8,1300,'2023-01-11'),(51,'Formula 99 Drops',8,1300,'2023-01-11'),(52,'Salajeet Drops',8,800,'2023-01-11'),(53,'D-Fit Ampules Drops',8,550,'2023-01-11'),(54,'Paloosa Honey 250g',9,250,'2023-01-11'),(55,'Paloosa Honey 500g',9,430,'2023-01-11'),(56,'Paloosa Honey 1kg',9,750,'2023-01-11'),(57,'Malta Honey 250g',9,320,'2023-01-11'),(58,'Malta Honey 500g',9,550,'2023-01-11'),(59,'Malta Honey 1kg',9,950,'2023-01-11'),(60,'Beri Honey 250g',9,580,'2023-01-11'),(61,'Beri Honey 500g',9,1100,'2023-01-11'),(62,'Beri Honey 1kg',9,2100,'2023-01-11'),(63,'Ajwain Honey 250g',9,450,'2023-01-11'),(64,'Ajwain Honey 500g',9,800,'2023-01-11'),(65,'Ajwain Honey 1kg',9,1400,'2023-01-11'),(66,'Ajwah Paste Honey 850g',9,850,'2023-01-17'),(67,'Baby Honey Bee Honey',9,1000,'2023-01-15'),(68,'Royal Jelly Honey',9,500,'2023-01-11'),(70,'Super Sonic Syrup',3,1000,'2023-01-14'),(71,'test update',2,500,'2023-01-15');
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

-- Dump completed on 2023-01-18  8:38:08

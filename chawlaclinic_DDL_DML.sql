-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 11, 2023 at 01:32 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chawlaclinic`
--
CREATE DATABASE IF NOT EXISTS `chawlaclinic` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `chawlaclinic`;

-- --------------------------------------------------------

--
-- Table structure for table `patientdescriptions`
--

CREATE TABLE `patientdescriptions` (
  `PatientID` int(11) NOT NULL,
  `Description` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `patientdetails`
--

CREATE TABLE `patientdetails` (
  `PatientID` int(11) NOT NULL,
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
  `DiscountMode` varchar(15) COLLATE utf8_bin NOT NULL DEFAULT 'None'
) ;

--
-- Dumping data for table `patientdetails`
--

INSERT INTO `patientdetails` (`PatientID`, `CaseNo`, `Type`, `PatientName`, `Age`, `Gender`, `GuardianName`, `Disease`, `Address`, `PhoneNumber`, `Status`, `FirstVisit`, `Balance`, `DiscountMode`) VALUES
(140870, '22B-000001', 'B', 'Khizir Farrukh Chawla', 21.917, 'M', 'Sheikh Muhammad Farrukh Chawla', 'headache', '1-C 5/6 Nazimabad No. 1', '03223131265', 'ACTIVE', '2022-08-25', 0, 'None'),
(140871, '23B-000001', 'B', 'Muhammad Ibrahim Farrukh Chawla', 8.667, 'M', 'Sheikh Muhammad Farrukh Chawla', 'hehe', '1-C 5/6 Nazimabad No. 1, Karachi', '03212937073', 'ACTIVE', '2023-01-08', 0, 'Zakat');

-- --------------------------------------------------------

--
-- Table structure for table `patientdressingrecord`
--

CREATE TABLE `patientdressingrecord` (
  `DressingID` int(11) NOT NULL,
  `PaymentID` int(11) NOT NULL,
  `QtyOfPads` float NOT NULL,
  `TotalAmount` int(11) NOT NULL,
  `DressingDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `patientdressingrecord`
--

INSERT INTO `patientdressingrecord` (`DressingID`, `PaymentID`, `QtyOfPads`, `TotalAmount`, `DressingDate`) VALUES
(1250, 1309, 1.25, 1000, '2023-01-05'),
(1251, 1310, 1, 800, '2023-01-05'),
(1252, 1314, 2.5, 2000, '2023-01-08'),
(1253, 1319, 2.25, 1800, '2023-01-10'),
(1254, 1321, 2.5, 2000, '2023-01-10'),
(1255, 1322, 2.5, 2000, '2023-01-09'),
(1256, 1325, 2.5, 2000, '2023-01-11'),
(1257, 1327, 2.5, 2000, '2023-01-12'),
(1259, 1329, 2.5, 2000, '2023-01-13'),
(1260, 1330, 2.25, 1800, '2023-01-11'),
(1261, 1331, 2.75, 2200, '2023-01-11');

-- --------------------------------------------------------

--
-- Table structure for table `patientdressingtemphold`
--

CREATE TABLE `patientdressingtemphold` (
  `PatientID` int(11) NOT NULL,
  `DressingDate` date NOT NULL,
  `QtyOfPads` float NOT NULL,
  `TotalAmount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `patientgeneralmedicinerecord`
--

CREATE TABLE `patientgeneralmedicinerecord` (
  `MedicineID` int(11) NOT NULL,
  `PatientID` int(11) NOT NULL,
  `PaymentID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `PurchaseAmount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Stand-in structure for view `patientointmentpurchased`
-- (See below for the actual view)
--
CREATE TABLE `patientointmentpurchased` (
`PurchaseID` int(11)
,`ProductID` int(11)
,`Quantity` int(11)
,`Amount` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `patientotherprodspurchased`
-- (See below for the actual view)
--
CREATE TABLE `patientotherprodspurchased` (
`PurchaseID` int(11)
,`ProductID` int(11)
,`Quantity` int(11)
,`Amount` int(11)
);

-- --------------------------------------------------------

--
-- Table structure for table `patientpaymentrecord`
--

CREATE TABLE `patientpaymentrecord` (
  `PaymentID` int(11) NOT NULL,
  `PatientID` int(11) NOT NULL,
  `TotalAmount` int(11) NOT NULL,
  `AmountPaid` int(11) NOT NULL,
  `AmountReduction` int(11) NOT NULL,
  `Date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `patientpaymentrecord`
--

INSERT INTO `patientpaymentrecord` (`PaymentID`, `PatientID`, `TotalAmount`, `AmountPaid`, `AmountReduction`, `Date`) VALUES
(1308, 140870, 1900, 1900, 0, '2023-01-01'),
(1309, 140870, 2300, 2000, 0, '2023-01-05'),
(1310, 140870, 800, 1000, 0, '2023-01-05'),
(1311, 140870, 700, 700, 0, '2023-01-06'),
(1312, 140870, 0, 100, 0, '2023-01-07'),
(1313, 140870, 0, 1000, 0, '2023-01-07'),
(1314, 140871, 2000, 2000, 0, '2023-01-08'),
(1319, 140870, 5550, 4550, 0, '2023-01-10'),
(1321, 140871, 2000, 2000, 0, '2023-01-10'),
(1322, 140871, 2000, 1500, 500, '2023-01-09'),
(1325, 140871, 2000, 1500, 500, '2023-01-10'),
(1327, 140871, 2000, 1500, 500, '2023-01-10'),
(1329, 140871, 2000, 1500, 500, '2023-01-10'),
(1330, 140870, 1800, 1800, 0, '2023-01-10'),
(1331, 140870, 6650, 7000, 0, '2023-01-11');

-- --------------------------------------------------------

--
-- Table structure for table `patientproductscart`
--

CREATE TABLE `patientproductscart` (
  `ProductID` int(11) NOT NULL,
  `PatientID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `patientproductspurchased`
--

CREATE TABLE `patientproductspurchased` (
  `PurchaseID` int(11) NOT NULL,
  `PaymentID` int(11) NOT NULL,
  `TotalAmount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `patientproductspurchased`
--

INSERT INTO `patientproductspurchased` (`PurchaseID`, `PaymentID`, `TotalAmount`) VALUES
(40, 1308, 1900),
(41, 1309, 1300),
(42, 1311, 700),
(47, 1319, 3750),
(49, 1331, 4450);

-- --------------------------------------------------------

--
-- Table structure for table `patientproductspurchaseditems`
--

CREATE TABLE `patientproductspurchaseditems` (
  `PurchaseID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `Amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `patientproductspurchaseditems`
--

INSERT INTO `patientproductspurchaseditems` (`PurchaseID`, `ProductID`, `Quantity`, `Amount`) VALUES
(40, 8, 2, 1200),
(40, 10, 1, 700),
(41, 8, 1, 600),
(41, 10, 1, 700),
(42, 39, 2, 700),
(47, 8, 1, 600),
(47, 10, 3, 2100),
(47, 39, 3, 1050),
(49, 8, 2, 1200),
(49, 45, 3, 750),
(49, 48, 1, 600),
(49, 59, 2, 1900);

-- --------------------------------------------------------

--
-- Table structure for table `patienttokenlogs`
--

CREATE TABLE `patienttokenlogs` (
  `PatientID` int(11) DEFAULT NULL,
  `TokenNumber` int(11) NOT NULL,
  `PatientName` varchar(200) COLLATE utf8_bin NOT NULL,
  `TokenType` varchar(6) COLLATE utf8_bin NOT NULL,
  `TokenDateTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `patienttokenlogs`
--

INSERT INTO `patienttokenlogs` (`PatientID`, `TokenNumber`, `PatientName`, `TokenType`, `TokenDateTime`) VALUES
(NULL, 1, 'asd', 'Male', '2022-08-20 16:32:46'),
(NULL, 1, 'srytuj', 'Female', '2022-08-20 16:33:15'),
(NULL, 1, 'asd', 'Female', '2022-08-20 16:35:30'),
(NULL, 1, 'asdasdasdasd sad asd as fasf sad asd', 'Male', '2022-08-20 16:37:13'),
(NULL, 2, 'brorojasoda ospidj', 'Male', '2022-08-20 16:37:56'),
(NULL, 1, 'asd', 'Male', '2022-08-21 10:58:04'),
(NULL, 1, 'fdsfsddsf', 'Female', '2022-08-21 10:58:55'),
(NULL, 2, 'asdasd', 'Male', '2022-08-21 11:00:09'),
(NULL, 1, 'sadasdasd', 'Child', '2022-08-21 11:00:54'),
(NULL, 3, 'asdasd', 'Male', '2022-08-21 11:02:59'),
(NULL, 4, 'sadasd', 'Male', '2022-08-21 11:03:29'),
(NULL, 5, 'asdasdasdasdasd', 'Male', '2022-08-21 11:05:56'),
(NULL, 6, 'asdasd', 'Male', '2022-08-21 11:08:19'),
(NULL, 7, 'sadasdasdasd', 'Male', '2022-08-21 11:08:39'),
(NULL, 2, 'sadasd', 'Female', '2022-08-21 11:09:40'),
(NULL, 2, 'gfsdfhsfghrs', 'Child', '2022-08-21 11:16:32'),
(NULL, 3, 'asdasd', 'Child', '2022-08-21 11:17:45');

-- --------------------------------------------------------

--
-- Table structure for table `patienttokennumbers`
--

CREATE TABLE `patienttokennumbers` (
  `TokenNumber` int(11) NOT NULL,
  `TokenType` varchar(6) COLLATE utf8_bin NOT NULL,
  `PatientName` varchar(200) COLLATE utf8_bin NOT NULL,
  `TokenDateTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `paymentdiscounts`
--

CREATE TABLE `paymentdiscounts` (
  `PaymentID` int(11) NOT NULL,
  `DiscountOption` varchar(15) COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `paymentdiscounts`
--

INSERT INTO `paymentdiscounts` (`PaymentID`, `DiscountOption`) VALUES
(1322, 'Zakat'),
(1325, 'Zakat'),
(1327, 'Zakat'),
(1329, 'Zakat');

-- --------------------------------------------------------

--
-- Table structure for table `productcategory`
--

CREATE TABLE `productcategory` (
  `CategoryID` int(11) NOT NULL,
  `CategoryName` varchar(100) COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `productcategory`
--

INSERT INTO `productcategory` (`CategoryID`, `CategoryName`) VALUES
(1, 'Dressing Pad'),
(2, 'Ointment'),
(3, 'Syrup'),
(4, 'Capsule'),
(5, 'Tablet'),
(6, 'Oil'),
(7, 'Soap'),
(8, 'Drops'),
(9, 'Honey');

-- --------------------------------------------------------

--
-- Table structure for table `productinventory`
--

CREATE TABLE `productinventory` (
  `ProductID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `LastUpdated` date NOT NULL
) ;

--
-- Dumping data for table `productinventory`
--

INSERT INTO `productinventory` (`ProductID`, `Quantity`, `LastUpdated`) VALUES
(8, 100, '2022-11-03'),
(9, 100, '2022-11-03'),
(10, 100, '2022-11-03'),
(11, 100, '2022-11-03'),
(12, 100, '2022-11-03'),
(13, 100, '2022-11-03'),
(39, 100, '2023-01-06'),
(40, 100, '2023-01-11'),
(41, 100, '2023-01-11'),
(42, 100, '2023-01-11'),
(43, 100, '2023-01-11'),
(44, 100, '2023-01-11'),
(45, 100, '2023-01-11'),
(46, 100, '2023-01-11'),
(47, 100, '2023-01-11'),
(48, 100, '2023-01-11'),
(49, 100, '2023-01-11'),
(50, 100, '2023-01-11'),
(51, 100, '2023-01-11'),
(52, 100, '2023-01-11'),
(53, 100, '2023-01-11'),
(54, 100, '2023-01-11'),
(55, 100, '2023-01-11'),
(56, 100, '2023-01-11'),
(57, 100, '2023-01-11'),
(58, 100, '2023-01-11'),
(59, 100, '2023-01-11'),
(60, 100, '2023-01-11'),
(61, 100, '2023-01-11'),
(62, 100, '2023-01-11'),
(63, 100, '2023-01-11'),
(64, 100, '2023-01-11'),
(65, 100, '2023-01-11'),
(66, 100, '2023-01-11'),
(67, 100, '2023-01-11'),
(68, 100, '2023-01-11');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `ProductID` int(11) NOT NULL,
  `ProductName` varchar(150) COLLATE utf8_bin NOT NULL,
  `ProductCategoryID` int(11) NOT NULL,
  `ProductPrice` int(11) NOT NULL,
  `LastUpdated` date NOT NULL
) ;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`ProductID`, `ProductName`, `ProductCategoryID`, `ProductPrice`, `LastUpdated`) VALUES
(1, 'Dressing Pad 1/4 below 1', 1, 500, '2022-09-18'),
(2, 'Dressing Pad 1/2 below 1', 1, 600, '2022-09-18'),
(3, 'Dressing Pad 3/4 below 1', 1, 700, '2022-09-18'),
(4, 'Dressing Pad 1', 1, 800, '2022-09-18'),
(5, 'Dressing Pad 1/4 above 1', 1, 200, '2022-09-18'),
(6, 'Dressing Pad 1/2 above 1', 1, 400, '2022-09-18'),
(7, 'Dressing Pad 3/4 above 1', 1, 600, '2022-09-18'),
(8, 'Burnaid', 2, 600, '2022-11-03'),
(9, 'Burnaid Plus', 2, 650, '2022-11-03'),
(10, 'Burnaid Plus AC', 2, 700, '2022-11-03'),
(11, 'Sulfur Ointment', 2, 700, '2022-11-03'),
(12, 'Lotion', 2, 600, '2022-11-03'),
(13, 'Vaseline', 2, 500, '2022-11-03'),
(39, 'Saeed Ghani Sandal Soap', 7, 350, '2023-01-06'),
(40, 'Box Soap', 7, 430, '2023-01-11'),
(41, 'James Acne Soap', 7, 280, '2023-01-11'),
(42, 'James Acne Spots Soap', 7, 280, '2023-01-11'),
(43, 'Sulphur Soap', 7, 470, '2023-01-11'),
(44, 'Neem Plus Soap', 7, 250, '2023-01-11'),
(45, 'Goat Milk Soap', 7, 250, '2023-01-11'),
(46, 'Ilham Soap', 7, 280, '2023-01-11'),
(47, 'Rice Soap', 7, 660, '2023-01-11'),
(48, 'Zia Oil', 6, 600, '2023-01-11'),
(49, 'Dr. Silin Hair Ampules Oil', 6, 400, '2023-01-11'),
(50, 'Super Sonic Drops', 8, 1300, '2023-01-11'),
(51, 'Formula 99 Drops', 8, 1300, '2023-01-11'),
(52, 'Salajeet Drops', 8, 800, '2023-01-11'),
(53, 'D-Fit Ampules Drops', 8, 550, '2023-01-11'),
(54, 'Paloosa Honey 250g', 9, 250, '2023-01-11'),
(55, 'Paloosa Honey 500g', 9, 430, '2023-01-11'),
(56, 'Paloosa Honey 1kg', 9, 750, '2023-01-11'),
(57, 'Malta Honey 250g', 9, 320, '2023-01-11'),
(58, 'Malta Honey 500g', 9, 550, '2023-01-11'),
(59, 'Malta Honey 1kg', 9, 950, '2023-01-11'),
(60, 'Beri Honey 250g', 9, 580, '2023-01-11'),
(61, 'Beri Honey 500g', 9, 1100, '2023-01-11'),
(62, 'Beri Honey 1kg', 9, 2100, '2023-01-11'),
(63, 'Ajwain Honey 250g', 9, 450, '2023-01-11'),
(64, 'Ajwain Honey 500g', 9, 800, '2023-01-11'),
(65, 'Ajwain Honey 1kg', 9, 1400, '2023-01-11'),
(66, 'Ajwah Paste Honey 850g', 9, 850, '2023-01-11'),
(67, 'Baby Honey Bee Honey', 9, 1000, '2023-01-11'),
(68, 'Royal Jelly Honey', 9, 500, '2023-01-11');

-- --------------------------------------------------------

--
-- Structure for view `patientointmentpurchased`
--
DROP TABLE IF EXISTS `patientointmentpurchased`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `patientointmentpurchased`  AS SELECT `pppi`.`PurchaseID` AS `PurchaseID`, `pppi`.`ProductID` AS `ProductID`, `pppi`.`Quantity` AS `Quantity`, `pppi`.`Amount` AS `Amount` FROM ((`patientproductspurchaseditems` `pppi` join `products` `p` on(`pppi`.`ProductID` = `p`.`ProductID`)) join `productcategory` `pc` on(`p`.`ProductCategoryID` = `pc`.`CategoryID`)) WHERE `pc`.`CategoryName` = 'Ointment' ;

-- --------------------------------------------------------

--
-- Structure for view `patientotherprodspurchased`
--
DROP TABLE IF EXISTS `patientotherprodspurchased`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `patientotherprodspurchased`  AS SELECT `prodpurchaseitems`.`PurchaseID` AS `PurchaseID`, `prodpurchaseitems`.`ProductID` AS `ProductID`, `prodpurchaseitems`.`Quantity` AS `Quantity`, `prodpurchaseitems`.`Amount` AS `Amount` FROM ((`patientproductspurchaseditems` `prodpurchaseitems` join `products` `prods` on(`prodpurchaseitems`.`ProductID` = `prods`.`ProductID`)) join `productcategory` `categ` on(`prods`.`ProductCategoryID` = `categ`.`CategoryID`)) WHERE `categ`.`CategoryName` <> 'Ointment' AND `categ`.`CategoryName` <> 'Dressing Pad' ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `patientdescriptions`
--
ALTER TABLE `patientdescriptions`
  ADD PRIMARY KEY (`PatientID`);

--
-- Indexes for table `patientdetails`
--
ALTER TABLE `patientdetails`
  ADD PRIMARY KEY (`PatientID`);

--
-- Indexes for table `patientdressingrecord`
--
ALTER TABLE `patientdressingrecord`
  ADD PRIMARY KEY (`DressingID`),
  ADD KEY `PaymentID` (`PaymentID`);

--
-- Indexes for table `patientdressingtemphold`
--
ALTER TABLE `patientdressingtemphold`
  ADD PRIMARY KEY (`PatientID`);

--
-- Indexes for table `patientgeneralmedicinerecord`
--
ALTER TABLE `patientgeneralmedicinerecord`
  ADD PRIMARY KEY (`MedicineID`),
  ADD KEY `PatientID` (`PatientID`),
  ADD KEY `PaymentID` (`PaymentID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `patientpaymentrecord`
--
ALTER TABLE `patientpaymentrecord`
  ADD PRIMARY KEY (`PaymentID`),
  ADD KEY `PatientID` (`PatientID`);

--
-- Indexes for table `patientproductscart`
--
ALTER TABLE `patientproductscart`
  ADD PRIMARY KEY (`ProductID`,`PatientID`),
  ADD KEY `PatientID` (`PatientID`);

--
-- Indexes for table `patientproductspurchased`
--
ALTER TABLE `patientproductspurchased`
  ADD PRIMARY KEY (`PurchaseID`),
  ADD KEY `PaymentID` (`PaymentID`);

--
-- Indexes for table `patientproductspurchaseditems`
--
ALTER TABLE `patientproductspurchaseditems`
  ADD PRIMARY KEY (`PurchaseID`,`ProductID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `patienttokenlogs`
--
ALTER TABLE `patienttokenlogs`
  ADD KEY `PatientID` (`PatientID`);

--
-- Indexes for table `paymentdiscounts`
--
ALTER TABLE `paymentdiscounts`
  ADD PRIMARY KEY (`PaymentID`);

--
-- Indexes for table `productcategory`
--
ALTER TABLE `productcategory`
  ADD PRIMARY KEY (`CategoryID`);

--
-- Indexes for table `productinventory`
--
ALTER TABLE `productinventory`
  ADD PRIMARY KEY (`ProductID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`ProductID`),
  ADD KEY `ProductCategoryID` (`ProductCategoryID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `patientdetails`
--
ALTER TABLE `patientdetails`
  MODIFY `PatientID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patientdressingrecord`
--
ALTER TABLE `patientdressingrecord`
  MODIFY `DressingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1262;

--
-- AUTO_INCREMENT for table `patientgeneralmedicinerecord`
--
ALTER TABLE `patientgeneralmedicinerecord`
  MODIFY `MedicineID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patientpaymentrecord`
--
ALTER TABLE `patientpaymentrecord`
  MODIFY `PaymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1332;

--
-- AUTO_INCREMENT for table `patientproductspurchased`
--
ALTER TABLE `patientproductspurchased`
  MODIFY `PurchaseID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `productcategory`
--
ALTER TABLE `productcategory`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `ProductID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `patientdescriptions`
--
ALTER TABLE `patientdescriptions`
  ADD CONSTRAINT `patientdescriptions_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`);

--
-- Constraints for table `patientdressingrecord`
--
ALTER TABLE `patientdressingrecord`
  ADD CONSTRAINT `patientdressingrecord_ibfk_2` FOREIGN KEY (`PaymentID`) REFERENCES `patientpaymentrecord` (`PaymentID`);

--
-- Constraints for table `patientdressingtemphold`
--
ALTER TABLE `patientdressingtemphold`
  ADD CONSTRAINT `patientdressingtemphold_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`);

--
-- Constraints for table `patientgeneralmedicinerecord`
--
ALTER TABLE `patientgeneralmedicinerecord`
  ADD CONSTRAINT `patientgeneralmedicinerecord_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`),
  ADD CONSTRAINT `patientgeneralmedicinerecord_ibfk_2` FOREIGN KEY (`PaymentID`) REFERENCES `patientpaymentrecord` (`PaymentID`),
  ADD CONSTRAINT `patientgeneralmedicinerecord_ibfk_3` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`);

--
-- Constraints for table `patientpaymentrecord`
--
ALTER TABLE `patientpaymentrecord`
  ADD CONSTRAINT `patientpaymentrecord_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`);

--
-- Constraints for table `patientproductscart`
--
ALTER TABLE `patientproductscart`
  ADD CONSTRAINT `patientproductscart_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`),
  ADD CONSTRAINT `patientproductscart_ibfk_2` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`);

--
-- Constraints for table `patientproductspurchased`
--
ALTER TABLE `patientproductspurchased`
  ADD CONSTRAINT `patientproductspurchased_ibfk_2` FOREIGN KEY (`PaymentID`) REFERENCES `patientpaymentrecord` (`PaymentID`);

--
-- Constraints for table `patientproductspurchaseditems`
--
ALTER TABLE `patientproductspurchaseditems`
  ADD CONSTRAINT `patientproductspurchaseditems_ibfk_1` FOREIGN KEY (`PurchaseID`) REFERENCES `patientproductspurchased` (`PurchaseID`),
  ADD CONSTRAINT `patientproductspurchaseditems_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`);

--
-- Constraints for table `patienttokenlogs`
--
ALTER TABLE `patienttokenlogs`
  ADD CONSTRAINT `patienttokenlogs_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`);

--
-- Constraints for table `paymentdiscounts`
--
ALTER TABLE `paymentdiscounts`
  ADD CONSTRAINT `paymentdiscounts_ibfk_1` FOREIGN KEY (`PaymentID`) REFERENCES `patientpaymentrecord` (`PaymentID`);

--
-- Constraints for table `productinventory`
--
ALTER TABLE `productinventory`
  ADD CONSTRAINT `productinventory_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`ProductCategoryID`) REFERENCES `productcategory` (`CategoryID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

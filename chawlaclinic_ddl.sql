-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 20, 2022 at 11:56 AM
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
-- Table structure for table `accounts`
--

CREATE TABLE IF NOT EXISTS `accounts` (
  `username` varchar(50) COLLATE utf8_bin NOT NULL,
  `password` varchar(50) COLLATE utf8_bin NOT NULL,
  `fullname` varchar(50) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`username`, `password`, `fullname`) VALUES
('ADMIN', 'admin', 'Administrator');

-- --------------------------------------------------------

--
-- Table structure for table `discounts`
--

CREATE TABLE IF NOT EXISTS `discounts` (
  `PaymentID` int(11) NOT NULL,
  `DiscountOption` varchar(15) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`PaymentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `patientcart`
--

CREATE TABLE IF NOT EXISTS `patientcart` (
  `ProductID` int(11) NOT NULL,
  `PatientID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  PRIMARY KEY (`ProductID`,`PatientID`),
  KEY `PatientID` (`PatientID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `patientdescriptions`
--

CREATE TABLE IF NOT EXISTS `patientdescriptions` (
  `PatientID` int(11) NOT NULL,
  `Description` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`PatientID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `patientdetails`
--

CREATE TABLE IF NOT EXISTS `patientdetails` (
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
  `AddedBy` varchar(50) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`PatientID`),
  KEY `AddedBy` (`AddedBy`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `patientdressingrecord`
--

CREATE TABLE IF NOT EXISTS `patientdressingrecord` (
  `DressingID` int(11) NOT NULL AUTO_INCREMENT,
  `PatientID` int(11) NOT NULL,
  `PaymentID` int(11) NOT NULL,
  `QtyOfPads` float NOT NULL,
  PRIMARY KEY (`DressingID`),
  KEY `PatientID` (`PatientID`),
  KEY `PaymentID` (`PaymentID`)
) ENGINE=InnoDB AUTO_INCREMENT=1248 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `patientgeneralmedicinerecord`
--

CREATE TABLE IF NOT EXISTS `patientgeneralmedicinerecord` (
  `MedicineID` int(11) NOT NULL AUTO_INCREMENT,
  `PatientID` int(11) NOT NULL,
  `PaymentID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `PurchaseAmount` int(11) NOT NULL,
  PRIMARY KEY (`MedicineID`),
  KEY `PatientID` (`PatientID`),
  KEY `PaymentID` (`PaymentID`),
  KEY `ProductID` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `patientpaymentrecord`
--

CREATE TABLE IF NOT EXISTS `patientpaymentrecord` (
  `PaymentID` int(11) NOT NULL AUTO_INCREMENT,
  `PatientID` int(11) NOT NULL,
  `TotalAmount` int(11) NOT NULL,
  `AmountPaid` int(11) NOT NULL,
  `AmountReduction` int(11) NOT NULL,
  `Date` date NOT NULL,
  `AddedBy` varchar(50) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`PaymentID`),
  KEY `PatientID` (`PatientID`),
  KEY `AddedBy` (`AddedBy`)
) ENGINE=InnoDB AUTO_INCREMENT=1297 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `patientproductpurchasehistory`
--

CREATE TABLE IF NOT EXISTS `patientproductpurchasehistory` (
  `PurchaseID` int(11) NOT NULL AUTO_INCREMENT,
  `PatientID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `PaymentID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  PRIMARY KEY (`PurchaseID`),
  KEY `PatientID` (`PatientID`),
  KEY `PaymentID` (`PaymentID`),
  KEY `ProductID` (`ProductID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `patienttokenlogs`
--

CREATE TABLE IF NOT EXISTS `patienttokenlogs` (
  `PatientID` int(11) DEFAULT NULL,
  `TokenNumber` int(11) NOT NULL,
  `PatientName` varchar(200) COLLATE utf8_bin NOT NULL,
  `TokenType` varchar(6) COLLATE utf8_bin NOT NULL,
  `TokenDateTime` datetime NOT NULL,
  KEY `PatientID` (`PatientID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `patienttokennumbers`
--

CREATE TABLE IF NOT EXISTS `patienttokennumbers` (
  `TokenNumber` int(11) NOT NULL,
  `TokenType` varchar(6) COLLATE utf8_bin NOT NULL,
  `PatientName` varchar(200) COLLATE utf8_bin NOT NULL,
  `TokenDateTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `productcategory`
--

CREATE TABLE IF NOT EXISTS `productcategory` (
  `CategoryID` int(11) NOT NULL AUTO_INCREMENT,
  `CategoryName` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `AddedBy` varchar(50) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`CategoryID`),
  KEY `AddedBy` (`AddedBy`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `productinventory`
--

CREATE TABLE IF NOT EXISTS `productinventory` (
  `ProductID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `LastUpdated` date NOT NULL,
  `ModifiedBy` varchar(50) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`ProductID`),
  KEY `ModifiedBy` (`ModifiedBy`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE IF NOT EXISTS `products` (
  `ProductID` int(11) NOT NULL AUTO_INCREMENT,
  `ProductName` varchar(150) COLLATE utf8_bin NOT NULL,
  `ProductCategoryID` int(11) NOT NULL,
  `ProductPrice` int(11) NOT NULL,
  `LastUpdated` date NOT NULL,
  `ModifiedBy` varchar(50) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`ProductID`),
  KEY `ProductCategoryID` (`ProductCategoryID`),
  KEY `ModifiedBy` (`ModifiedBy`)
) ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `discounts`
--
ALTER TABLE `discounts`
  ADD CONSTRAINT `discounts_ibfk_1` FOREIGN KEY (`PaymentID`) REFERENCES `patientpaymentrecord` (`PaymentID`);

--
-- Constraints for table `patientcart`
--
ALTER TABLE `patientcart`
  ADD CONSTRAINT `patientcart_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`),
  ADD CONSTRAINT `patientcart_ibfk_2` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`);

--
-- Constraints for table `patientdescriptions`
--
ALTER TABLE `patientdescriptions`
  ADD CONSTRAINT `patientdescriptions_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`);

--
-- Constraints for table `patientdetails`
--
ALTER TABLE `patientdetails`
  ADD CONSTRAINT `patientdetails_ibfk_1` FOREIGN KEY (`AddedBy`) REFERENCES `accounts` (`username`);

--
-- Constraints for table `patientdressingrecord`
--
ALTER TABLE `patientdressingrecord`
  ADD CONSTRAINT `patientdressingrecord_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`),
  ADD CONSTRAINT `patientdressingrecord_ibfk_2` FOREIGN KEY (`PaymentID`) REFERENCES `patientpaymentrecord` (`PaymentID`);

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
  ADD CONSTRAINT `patientpaymentrecord_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`),
  ADD CONSTRAINT `patientpaymentrecord_ibfk_2` FOREIGN KEY (`AddedBy`) REFERENCES `accounts` (`username`);

--
-- Constraints for table `patientproductpurchasehistory`
--
ALTER TABLE `patientproductpurchasehistory`
  ADD CONSTRAINT `patientproductpurchasehistory_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`),
  ADD CONSTRAINT `patientproductpurchasehistory_ibfk_2` FOREIGN KEY (`PaymentID`) REFERENCES `patientpaymentrecord` (`PaymentID`),
  ADD CONSTRAINT `patientproductpurchasehistory_ibfk_3` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`);

--
-- Constraints for table `patienttokenlogs`
--
ALTER TABLE `patienttokenlogs`
  ADD CONSTRAINT `patienttokenlogs_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`);

--
-- Constraints for table `productcategory`
--
ALTER TABLE `productcategory`
  ADD CONSTRAINT `productcategory_ibfk_1` FOREIGN KEY (`AddedBy`) REFERENCES `accounts` (`username`);

--
-- Constraints for table `productinventory`
--
ALTER TABLE `productinventory`
  ADD CONSTRAINT `productinventory_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`),
  ADD CONSTRAINT `productinventory_ibfk_2` FOREIGN KEY (`ModifiedBy`) REFERENCES `accounts` (`username`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`ProductCategoryID`) REFERENCES `productcategory` (`CategoryID`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`ModifiedBy`) REFERENCES `accounts` (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

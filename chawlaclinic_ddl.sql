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


--
-- Constraints for table `patienttokenlogs`
--
ALTER TABLE `patienttokenlogs`
  ADD CONSTRAINT `patienttokenlogs_ibfk_1` FOREIGN KEY (`PatientID`) REFERENCES `patientdetails` (`PatientID`);


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 09, 2020 at 06:40 PM
-- Server version: 5.7.24
-- PHP Version: 7.2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `info_zgrada`
--

-- --------------------------------------------------------

--
-- Table structure for table `racun_cistac`
--

DROP TABLE IF EXISTS `racun_cistac`;
CREATE TABLE IF NOT EXISTS `racun_cistac` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vrednost_din` float NOT NULL,
  `datum` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `racun_cistac`
--

INSERT INTO `racun_cistac` (`id`, `vrednost_din`, `datum`) VALUES
(1, 22050.2, '6.1.2020.');

-- --------------------------------------------------------

--
-- Table structure for table `racun_struja`
--

DROP TABLE IF EXISTS `racun_struja`;
CREATE TABLE IF NOT EXISTS `racun_struja` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vrednost_kwh` int(100) NOT NULL,
  `vrednost_din` float NOT NULL,
  `datum` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `racun_struja`
--

INSERT INTO `racun_struja` (`id`, `vrednost_kwh`, `vrednost_din`, `datum`) VALUES
(3, 632, 2500, '9.2.2020.'),
(5, 632, 22050, '6.1.2020.'),
(6, 6355, 22050, '9.1.2020.');

-- --------------------------------------------------------

--
-- Table structure for table `racun_voda`
--

DROP TABLE IF EXISTS `racun_voda`;
CREATE TABLE IF NOT EXISTS `racun_voda` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vrednost_m3` int(100) NOT NULL,
  `vrednost_din` float NOT NULL,
  `datum` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `racun_voda`
--

INSERT INTO `racun_voda` (`id`, `vrednost_m3`, `vrednost_din`, `datum`) VALUES
(1, 1002, 22050, '6.1.2020.');

-- --------------------------------------------------------

--
-- Table structure for table `racun_zgrada`
--

DROP TABLE IF EXISTS `racun_zgrada`;
CREATE TABLE IF NOT EXISTS `racun_zgrada` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vrednost_din` float NOT NULL,
  `datum` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `racun_zgrada`
--

INSERT INTO `racun_zgrada` (`id`, `vrednost_din`, `datum`) VALUES
(1, 25003.2, '6.1.2020.');

-- --------------------------------------------------------

--
-- Table structure for table `stanari`
--

DROP TABLE IF EXISTS `stanari`;
CREATE TABLE IF NOT EXISTS `stanari` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ime` varchar(100) NOT NULL,
  `prezime` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `broj_telefona` varchar(100) NOT NULL,
  `datum_rodjenja` varchar(100) NOT NULL,
  `broj_licne_karte` varchar(20) NOT NULL,
  `broj_stana` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `brojStana` (`broj_stana`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `stanari`
--

INSERT INTO `stanari` (`id`, `ime`, `prezime`, `email`, `broj_telefona`, `datum_rodjenja`, `broj_licne_karte`, `broj_stana`) VALUES
(6, 'Nemanja', 'Igic', 'ni@gmail.com', '123123123', '2.4.1998.', '12312389', 4),
(9, 'Aleksa', 'Nejković', 'aleksa.nejkovic@vtsnis.rs', '0600326267', '27.06.1998', '0073122', 16),
(10, 'Nikola', 'Nikolic', 'nnn@gmail.com', '0602135', '12.09.1998.', '589647', 7);

-- --------------------------------------------------------

--
-- Table structure for table `stanar_struja`
--

DROP TABLE IF EXISTS `stanar_struja`;
CREATE TABLE IF NOT EXISTS `stanar_struja` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `u_vrednost_kwh` int(100) NOT NULL,
  `u_vrednost_din` float NOT NULL,
  `p_vrednost_kwh` float NOT NULL,
  `p_vrednost_din` float NOT NULL,
  `datum` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `stanar_struja`
--

INSERT INTO `stanar_struja` (`id`, `u_vrednost_kwh`, `u_vrednost_din`, `p_vrednost_kwh`, `p_vrednost_din`, `datum`) VALUES
(2, 6355, 22050, 2118.33, 7350, '6.1.2020.');

-- --------------------------------------------------------

--
-- Table structure for table `stanar_voda`
--

DROP TABLE IF EXISTS `stanar_voda`;
CREATE TABLE IF NOT EXISTS `stanar_voda` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `u_vrednost_m3` int(100) NOT NULL,
  `u_vrednost_din` float NOT NULL,
  `p_vrednost_m3` int(100) NOT NULL,
  `p_vrednost_din` float NOT NULL,
  `datum` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `stanar_voda`
--

INSERT INTO `stanar_voda` (`id`, `u_vrednost_m3`, `u_vrednost_din`, `p_vrednost_m3`, `p_vrednost_din`, `datum`) VALUES
(3, 1002, 22050, 334, 7350, '6.1.2020.');

-- --------------------------------------------------------

--
-- Table structure for table `stanovi`
--

DROP TABLE IF EXISTS `stanovi`;
CREATE TABLE IF NOT EXISTS `stanovi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `broj_stana` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `stanovi`
--

INSERT INTO `stanovi` (`id`, `broj_stana`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10),
(11, 11),
(12, 12),
(13, 13),
(14, 14),
(15, 15),
(16, 16),
(17, 17),
(18, 18),
(19, 19),
(20, 20),
(21, 21),
(22, 22),
(23, 23),
(24, 24);

-- --------------------------------------------------------

--
-- Table structure for table `upravnici`
--

DROP TABLE IF EXISTS `upravnici`;
CREATE TABLE IF NOT EXISTS `upravnici` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ime` varchar(100) NOT NULL,
  `prezime` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `broj_telefona` varchar(100) NOT NULL,
  `datum_rodjenja` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `upravnici`
--

INSERT INTO `upravnici` (`id`, `ime`, `prezime`, `email`, `broj_telefona`, `datum_rodjenja`) VALUES
(1, 'Jovan', 'Nikolic', 'jn@gmail.com', '06123456', '12.01.1969.');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `stanari`
--
ALTER TABLE `stanari`
  ADD CONSTRAINT `brojStana` FOREIGN KEY (`broj_stana`) REFERENCES `stanovi` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 4.0.8
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 14, 2014 at 01:02 PM
-- Server version: 5.5.32-cll-lve
-- PHP Version: 5.3.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `carpoolfinder`
--

-- --------------------------------------------------------

--
-- Table structure for table `carpoolLocation`
--

CREATE TABLE IF NOT EXISTS `carpoolLocation` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `arrivalCount` int(11) NOT NULL DEFAULT '0',
  `departureCount` int(11) NOT NULL DEFAULT '0',
  `searchCount` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `carpoolLocation`
--

INSERT INTO `carpoolLocation` (`id`, `name`, `arrivalCount`, `departureCount`, `searchCount`) VALUES
(1, 'Waterloo DC', 1, 0, 0),
(2, 'Toronto Downtown', 0, 1, 0),
(3, '333 King St N Waterloo', 1, 1, 0),
(4, '315 King St E Waterloo', 1, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `carpools`
--

CREATE TABLE IF NOT EXISTS `carpools` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `departure` varchar(50) DEFAULT NULL,
  `arrival` varchar(50) DEFAULT NULL,
  `user_id` int(8) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `price` float DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `date_created` datetime DEFAULT NULL,
  `last_edited` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `passenger` int(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=21 ;

--
-- Dumping data for table `carpools`
--

INSERT INTO `carpools` (`id`, `departure`, `arrival`, `user_id`, `date`, `price`, `type`, `description`, `date_created`, `last_edited`, `passenger`) VALUES
(1, 'Waterloo DC', 'Toronto Downtown', 1, '2014-02-13 09:00:00', 20, 'offer', '提供2月14号：7Eleven(King&University) to Fairview Mall\r\n下午3：30出发\r\n$15/person\r\n提供Waterloo,Kitchener室内搬家，机场接机，价格公道，欢迎咨询！时间地点您定\r\n\r\nG牌司机，车型宽敞舒适，可以聊天睡觉听歌，欢迎搭车！\r\n', '2014-02-12 23:00:48', '2014-02-13 04:01:15', 4),
(2, 'Waterloo WLU', 'Toronto Airport', 1, '2014-02-13 12:00:00', 15, 'request', 'Blah Blah Blah', '2014-02-12 23:32:25', '2014-02-13 04:34:04', 3),
(3, 'Toronto Markham', 'Waterloo', 1, '2014-02-13 12:00:00', 1, 'offer', 'hahahahahaha', '2014-02-12 23:32:25', '2014-03-06 19:11:45', 2),
(4, 'Toronto Markham', 'Waterloo', 2, '2014-02-13 12:00:00', 1, 'offer', 'hahahahahaha', '2014-02-12 23:32:25', '2014-03-06 19:11:45', 2),
(5, 'Toronto Markham', 'Waterloo', 2, '2014-02-13 12:00:00', 1, 'offer', 'hahahahahaha', '2014-02-12 23:32:25', '2014-03-06 19:11:45', 2),
(6, 'Toronto Markham', 'Waterloo', 2, '2014-02-13 12:00:00', 1, 'offer', 'hahahahahaha', '2014-02-12 23:32:25', '2014-03-06 19:11:45', 2),
(7, 'Toronto Markham', 'Waterloo', 2, '2014-02-13 12:00:00', 1, 'offer', 'hahahahahaha', '2014-02-12 23:32:25', '2014-03-06 19:11:45', 2),
(8, 'Toronto Markham', 'Waterloo', 2, '2014-02-13 12:00:00', 1, 'offer', 'hahahahahaha', '2014-02-12 23:32:25', '2014-03-06 19:11:45', 2),
(9, 'Toronto Markham', 'Waterloo', 2, '2014-02-13 12:00:00', 1, 'offer', 'hahahahahaha', '2014-02-12 23:32:25', '2014-03-06 19:11:45', 2),
(10, 'Toronto Markham', 'Waterloo', 2, '2014-02-13 12:00:00', 1, 'offer', 'hahahahahaha', '2014-02-12 23:32:25', '2014-03-06 19:11:45', 2),
(11, 'Toronto Markham', 'Waterloo', 2, '2014-02-13 12:00:00', 1, 'offer', 'hahahahahaha', '2014-02-12 23:32:25', '2014-03-06 19:11:45', 2),
(12, 'Toronto Markham', 'Waterloo', 2, '2014-02-13 12:00:00', 1, 'offer', 'hahahahahaha', '2014-02-12 23:32:25', '2014-03-06 19:11:45', 2),
(13, 'Toronto Markham', 'Waterloo', 2, '2014-02-13 12:00:00', 1, 'offer', 'hahahahahaha', '2014-02-12 23:32:25', '2014-03-06 19:11:45', 2),
(14, 'Toronto Markham', 'Waterloo', 2, '2014-02-13 12:00:00', 1, 'offer', 'hahahahahaha', '2014-02-12 23:32:25', '2014-03-06 19:11:45', 2),
(15, 'Toronto Markham', 'Waterloo', 2, '2014-02-13 12:00:00', 1, 'offer', 'hahahahahaha', '2014-02-12 23:32:25', '2014-03-06 19:11:45', 2),
(16, 'Toronto Markham', 'Waterloo', 2, '2014-02-13 12:00:00', 1, 'offer', 'hahahahahaha', '2014-02-12 23:32:25', '2014-03-06 19:11:45', 2),
(17, 'Toronto Markham', 'Waterloo', 2, '2014-02-13 12:00:00', 1, 'offer', 'hahahahahaha', '2014-02-12 23:32:25', '2014-03-06 19:11:45', 2),
(18, 'Toronto Markham', 'Waterloo', 2, '2014-02-13 12:00:00', 1, 'offer', 'hahahahahaha', '2014-02-12 23:32:25', '2014-03-06 19:11:45', 2),
(19, 'Toronto Markham', 'Waterloo', 2, '2014-02-13 12:00:00', 1, 'offer', 'hahahahahaha', '2014-02-12 23:32:25', '2014-03-06 19:11:45', 2),
(20, 'UW Plaza', 'Toronto', 2, '2014-03-25 09:10:00', 123, 'offer', 'nialsndiasdnlasd', NULL, '2014-03-15 21:03:55', 4);

-- --------------------------------------------------------

--
-- Table structure for table `login_attempts`
--

CREATE TABLE IF NOT EXISTS `login_attempts` (
  `user_id` int(11) NOT NULL,
  `time` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `passengers`
--

CREATE TABLE IF NOT EXISTS `passengers` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `user_id` int(8) DEFAULT NULL,
  `carpool_id` int(8) DEFAULT NULL,
  `passenger` int(2) NOT NULL DEFAULT '1',
  `paid` tinyint(1) NOT NULL DEFAULT '0',
  `pending` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `passengers`
--

INSERT INTO `passengers` (`id`, `user_id`, `carpool_id`, `passenger`, `paid`, `pending`) VALUES
(1, 2, 1, 1, 0, 1),
(2, 2, 2, 2, 0, 1),
(3, 2, 3, 1, 0, 1),
(4, 2, 4, 1, 0, 1),
(5, 2, 5, 1, 0, 1),
(6, 2, 6, 1, 0, 1),
(7, 8, 20, 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(30) NOT NULL DEFAULT '',
  `email` varchar(50) NOT NULL,
  `password` char(128) NOT NULL,
  `salt` char(128) NOT NULL,
  `lastname` varchar(30) DEFAULT NULL,
  `type` tinyint(4) DEFAULT '1',
  `emailverified` tinyint(1) NOT NULL DEFAULT '0',
  `cellphone` varchar(50) DEFAULT '',
  `profilePicture` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `email`, `password`, `salt`, `lastname`, `type`, `emailverified`, `cellphone`, `profilePicture`) VALUES
(1, 'Test', 'test@example.com', '00807432eae173f652f2064bdca1b61b290b52d40e429a7d295d76a71084aa96c0233b82f1feac45529e0726559645acaed6f3ae58a286b9f075916ebf66cacc', 'f9aab579fc1b41ed0c44fe4ecdbfcdb4cb99b9023abb241a6db833288f4eea3c02f76e0d35204a8695077dcf81932aa59006423976224be0390395bae152d4ef', 'Account', 1, 0, '', NULL),
(2, 'Luke', 'lzhaoyilun@gmail.com', '2dc3f2f5db9f0c1e18b2538dd5e67529a5f33c4ddc358c549b071edd24970f0f7d12b998ec939ae442862cfd330f645af3c6b1d76e6da9957652b406b2c20b3d', 'b9fb99d85338c390e54b519b37f1c2bd089371e28c8030db02e664f9579e3765397d7824d89c43daeaef3e478ccfd83277296fc54a9fe4472329a62143f92215', 'Zhao', 5, 0, '', '/images/tdp/1.39481615864E+12.jpg'),
(3, 'Ryan', 'test@test2.com', 'c1087daeab651734d531669698bfa4c26361d188982adfe1acea68b1ff1ee4fffea9b7e86b38f1fbc73c4cb07644a11d05e63219e6d56c64277994eb7fad6d58', '3c1c3bcd63524eabca857c5a877466d1efc280c0016939ab4a2f3d90baa26c5ae02e8b3f0d42436fb448526b2dcc2f27430d9949d4ffb9bb01244da60b849728', 'Zhao', 1, 0, '', NULL),
(4, 'jerry', 'abc@abc.com', 'fbf4dead510a50230c33d62e7a78222a11feee46be336829a3d65e562ad3a0b231f6597e16bd963d200b99b1ce3fb33d1cd634f746eba85d8c63226b2410f884', 'f7f903c990cd80ea4cac7ff6d2e5828316b006eece19b84a8459f0c1e3dfaa3813703bdd01e9c9f0933022ff5d4757413a2dcc89dabb4f08d7d397162d0708d4', 'feng', 3, 0, '', NULL),
(5, 'Jerry', 'houbojun@hotmail.com', 'b391d20e98fa4325858c8ed9a6fe65c36e89379784cf2703e093eac02db78d6162bf0969c96b8bf614fe726eaacafde40f8476850600d4475f2846930f3ae6be', 'a0aaa965eec95416acee1ffca6db045fd5a434fd6098d256ca8b60a9865f9fe642ffca9f107c1ee3abdb4ba10bf4f953e8090af5c1a9e81cb29b758b75681c10', 'Feng', 1, 0, '', NULL),
(6, 'Jerry', 'b9feng@gmail.com', '01d2f1b529209edac10ef5a75a46980c7d0de211bc6bc052f008744d69f7fce848ee15fc9983aff8fe43ee21ccfbdd72b294747c9e1ceb72e7355095603f43a4', 'e607f87ec115bfb091ceb24d26dc6e8b0b74b8a721389d023fe15fe9fa29a034c8cf343dba4f4d0df72d4b23c4a0d6d5baad3decbb95c9e2a5f5d36ae5c9c7f4', 'Feng', 1, 0, '', NULL),
(7, 'Jerry', 'abcd@abcd.com', 'dc9ea64a98f76426c4e3edc191a506be39fb0b620eeaa484ab24119d3c95f7cc71ebc4b15df44f73f682bb9db42eb76487c2069027fe8bbaf2b5199b456cd610', '3df8cc4b8e6607058135c0692bca55ee5c353a5f6baa7fce1d11f21e1cec1e7f40c9fb017778027b1c0321191bfbca5093e85b0541bf1c6279cf4cba5c72ccef', 'Test', 1, 0, '', NULL),
(8, 'TEST', 'test@uwcarpool.com', 'aa884bf19171cadb361a0084956f9722dad5357f6fb28fac6ebc4bc3e80740a08b429a696c34c04bc6165a9a08735ed25227284e8564f9ed22d96055d4832465', '1ef1cd1fd3eda1ab5c46b4bbe5837edc844f93a5f9f95e0afc71777eb841a8ff54a11762af5cb8c1d956dca6ffa78af3f0acb0b9052b31521e3daecf5f3fa5c2', 'ACCOUNT2', 1, 0, '', NULL);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

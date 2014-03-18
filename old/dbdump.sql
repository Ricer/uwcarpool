-- MySQL dump 10.13  Distrib 5.6.16, for osx10.7 (x86_64)
--
-- Host: www.lkz.ca    Database: carpoolfinder
-- ------------------------------------------------------
-- Server version	5.5.32-cll-lve

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carpool`
--

DROP TABLE IF EXISTS `carpool`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carpool` (
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
  `luggage` int(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carpool`
--

LOCK TABLES `carpool` WRITE;
/*!40000 ALTER TABLE `carpool` DISABLE KEYS */;
INSERT INTO `carpool` VALUES (1,'Waterloo DC','Toronto Downtown',1,'2014-02-13 09:00:00',20,'offer','提供2月14号：7Eleven(King&University) to Fairview Mall\r\n下午3：30出发\r\n$15/person\r\n提供Waterloo,Kitchener室内搬家，机场接机，价格公道，欢迎咨询！时间地点您定\r\n\r\nG牌司机，车型宽敞舒适，可以聊天睡觉听歌，欢迎搭车！\r\n','2014-02-12 23:00:48','2014-02-13 04:01:15',4,5),(2,'Waterloo WLU','Toronto Airport',1,'2014-02-13 12:00:00',15,'request','Blah Blah Blah','2014-02-12 23:32:25','2014-02-13 04:34:04',3,5),(3,'Toronto Markham','Waterloo',1,'2014-02-13 12:00:00',1,'offer','hahahahahaha','2014-02-12 23:32:25','2014-03-06 19:11:45',2,3),(4,'Toronto Markham','Waterloo',2,'2014-02-13 12:00:00',1,'offer','hahahahahaha','2014-02-12 23:32:25','2014-03-06 19:11:45',2,3),(5,'Toronto Markham','Waterloo',2,'2014-02-13 12:00:00',1,'offer','hahahahahaha','2014-02-12 23:32:25','2014-03-06 19:11:45',2,3),(6,'Toronto Markham','Waterloo',2,'2014-02-13 12:00:00',1,'offer','hahahahahaha','2014-02-12 23:32:25','2014-03-06 19:11:45',2,3),(7,'Toronto Markham','Waterloo',2,'2014-02-13 12:00:00',1,'offer','hahahahahaha','2014-02-12 23:32:25','2014-03-06 19:11:45',2,3),(8,'Toronto Markham','Waterloo',2,'2014-02-13 12:00:00',1,'offer','hahahahahaha','2014-02-12 23:32:25','2014-03-06 19:11:45',2,3),(9,'Toronto Markham','Waterloo',2,'2014-02-13 12:00:00',1,'offer','hahahahahaha','2014-02-12 23:32:25','2014-03-06 19:11:45',2,3),(10,'Toronto Markham','Waterloo',2,'2014-02-13 12:00:00',1,'offer','hahahahahaha','2014-02-12 23:32:25','2014-03-06 19:11:45',2,3),(11,'Toronto Markham','Waterloo',2,'2014-02-13 12:00:00',1,'offer','hahahahahaha','2014-02-12 23:32:25','2014-03-06 19:11:45',2,3),(12,'Toronto Markham','Waterloo',2,'2014-02-13 12:00:00',1,'offer','hahahahahaha','2014-02-12 23:32:25','2014-03-06 19:11:45',2,3),(13,'Toronto Markham','Waterloo',2,'2014-02-13 12:00:00',1,'offer','hahahahahaha','2014-02-12 23:32:25','2014-03-06 19:11:45',2,3),(14,'Toronto Markham','Waterloo',2,'2014-02-13 12:00:00',1,'offer','hahahahahaha','2014-02-12 23:32:25','2014-03-06 19:11:45',2,3),(15,'Toronto Markham','Waterloo',2,'2014-02-13 12:00:00',1,'offer','hahahahahaha','2014-02-12 23:32:25','2014-03-06 19:11:45',2,3),(16,'Toronto Markham','Waterloo',2,'2014-02-13 12:00:00',1,'offer','hahahahahaha','2014-02-12 23:32:25','2014-03-06 19:11:45',2,3),(17,'Toronto Markham','Waterloo',2,'2014-02-13 12:00:00',1,'offer','hahahahahaha','2014-02-12 23:32:25','2014-03-06 19:11:45',2,3),(18,'Toronto Markham','Waterloo',2,'2014-02-13 12:00:00',1,'offer','hahahahahaha','2014-02-12 23:32:25','2014-03-06 19:11:45',2,3),(19,'Toronto Markham','Waterloo',2,'2014-02-13 12:00:00',1,'offer','hahahahahaha','2014-02-12 23:32:25','2014-03-06 19:11:45',2,3);
/*!40000 ALTER TABLE `carpool` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_attempts`
--

DROP TABLE IF EXISTS `login_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `login_attempts` (
  `user_id` int(11) NOT NULL,
  `time` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_attempts`
--

LOCK TABLES `login_attempts` WRITE;
/*!40000 ALTER TABLE `login_attempts` DISABLE KEYS */;
/*!40000 ALTER TABLE `login_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(30) NOT NULL DEFAULT '',
  `email` varchar(50) NOT NULL,
  `password` char(128) NOT NULL,
  `salt` char(128) NOT NULL,
  `lastname` varchar(30) DEFAULT NULL,
  `type` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (1,'Test','test@example.com','00807432eae173f652f2064bdca1b61b290b52d40e429a7d295d76a71084aa96c0233b82f1feac45529e0726559645acaed6f3ae58a286b9f075916ebf66cacc','f9aab579fc1b41ed0c44fe4ecdbfcdb4cb99b9023abb241a6db833288f4eea3c02f76e0d35204a8695077dcf81932aa59006423976224be0390395bae152d4ef','Account',1),(2,'Luke','lzhaoyilun@gmail.com','2dc3f2f5db9f0c1e18b2538dd5e67529a5f33c4ddc358c549b071edd24970f0f7d12b998ec939ae442862cfd330f645af3c6b1d76e6da9957652b406b2c20b3d','b9fb99d85338c390e54b519b37f1c2bd089371e28c8030db02e664f9579e3765397d7824d89c43daeaef3e478ccfd83277296fc54a9fe4472329a62143f92215','Zhao',5),(3,'Ryan','test@test2.com','c1087daeab651734d531669698bfa4c26361d188982adfe1acea68b1ff1ee4fffea9b7e86b38f1fbc73c4cb07644a11d05e63219e6d56c64277994eb7fad6d58','3c1c3bcd63524eabca857c5a877466d1efc280c0016939ab4a2f3d90baa26c5ae02e8b3f0d42436fb448526b2dcc2f27430d9949d4ffb9bb01244da60b849728','Zhao',1),(4,'jerry','abc@abc.com','fbf4dead510a50230c33d62e7a78222a11feee46be336829a3d65e562ad3a0b231f6597e16bd963d200b99b1ce3fb33d1cd634f746eba85d8c63226b2410f884','f7f903c990cd80ea4cac7ff6d2e5828316b006eece19b84a8459f0c1e3dfaa3813703bdd01e9c9f0933022ff5d4757413a2dcc89dabb4f08d7d397162d0708d4','feng',3);
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `passengers`
--

DROP TABLE IF EXISTS `passengers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `passengers` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `user_id` int(8) DEFAULT NULL,
  `carpool_id` int(8) DEFAULT NULL,
  `passenger` int(2) NOT NULL DEFAULT '1',
  `luggage` int(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passengers`
--

LOCK TABLES `passengers` WRITE;
/*!40000 ALTER TABLE `passengers` DISABLE KEYS */;
INSERT INTO `passengers` VALUES (1,2,1,1,1),(2,2,2,2,3),(3,2,3,1,0),(4,2,4,1,0),(5,2,5,1,0),(6,2,6,1,0);
/*!40000 ALTER TABLE `passengers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `facebook_id` bigint(20) DEFAULT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,100000320746365,'Luke Zhao'),(2,100000707678809,'Jerry Feng');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-03-08  2:58:06

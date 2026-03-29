-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: user_system
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `site` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'facebookk.com','shiniekie@gmail.com','123','1774790237293-Jing.jpg',2,'2026-03-29 04:07:35'),(12,'facebook.com','shiniekiea@gmail.com','123','1774762514655-council.jpg',2,'2026-03-29 05:35:14'),(23,'facebook.com','shiniekie1@gmail.com','1','1774784087822-Jing.jpg',NULL,'2026-03-29 11:34:39');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `verification_token` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `login_token` varchar(255) DEFAULT NULL,
  `logout_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Shinie Kie Avila-Dangasi','shniekie@gmail.com','$2b$10$nHIkSuM9Alj4sbPnr1.F5en0dBNhMiMNole4vGvH9dsRPqai.bGEG',NULL,1,NULL,NULL,NULL,NULL,'2026-03-29 04:00:30'),(2,'','','$2b$10$ikrxiJfwZ0Tz9FMJ5IXtB.RW8lw6NsYLOtGif29VFrqMFWOOEobhm','1774787407181-famor.jpg',1,NULL,NULL,'o97um6ztj9',NULL,'2026-03-29 04:07:06'),(3,'Shinie Kie Avila-Dangasi','avilashinie@gmail.com','$2b$10$Ewh3nzZaK7P/F4S89We2d.igbw7tX0BpWVTzlOe464/mpMnbJa7q.',NULL,1,NULL,NULL,'9yonk3mfocf',NULL,'2026-03-29 06:13:01'),(4,'Shinie Kie Avila-Dangasi','avilashinie5@gmail.com','$2b$10$f3GJrkDWkktX3SWvP3TWReu1u1QSZa/9cx3XKVCQNV5EHAwHEzO.6',NULL,1,NULL,NULL,NULL,NULL,'2026-03-29 10:39:57'),(5,'Shinie Kie Avila-Dangasi','shiniekie@gmail.com','$2b$10$CNCNwY1gotSParHpF7UQoeHeEF8OG9qKCmd548g6iUbTq7BGLcuey','1774790541589-guiplogo.png',1,NULL,NULL,'i9l7wb3bbu',NULL,'2026-03-29 12:44:16');
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

-- Dump completed on 2026-03-29 21:51:20

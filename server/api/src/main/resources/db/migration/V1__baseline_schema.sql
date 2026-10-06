-- MySQL dump 10.13  Distrib 9.2.0, for macos14.7 (arm64)
--
-- Host: 127.0.0.1    Database: hubble
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `drafts`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drafts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `category` enum('DESIGN','DEVELOPMENT','LIFE','MARKETING','OTHER','PLANNING') DEFAULT NULL,
  `content` text,
  `image_url` varchar(255) DEFAULT NULL,
  `story_id` bigint DEFAULT NULL,
  `tags` text,
  `title` varchar(100) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_draft_user_updated` (`user_id`,`updated_at` DESC),
  CONSTRAINT `FKt095aluslcpg80yhy8bp2t6ux` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `email_verifications`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_verifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `email` varchar(255) NOT NULL,
  `expiry_date` datetime(6) NOT NULL,
  `is_verified` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `note_bookmarks`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `note_bookmarks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `note_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKh6sdpgqxhr5y9yqeii3u45lbm` (`user_id`,`note_id`),
  KEY `FKf907ismmpgrrlk89jxblu8tyu` (`note_id`),
  CONSTRAINT `FK33afuj1ui0jo53lmcce2fi3q` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKf907ismmpgrrlk89jxblu8tyu` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `note_likes`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `note_likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `note_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK5fjk7yh7bjjbjvhwwaggit705` (`user_id`,`note_id`),
  KEY `FKrgrwr78v7aiaaj1flbjpnw0y3` (`note_id`),
  CONSTRAINT `FKdsrbr2tu343dbmk05ivajoojq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKrgrwr78v7aiaaj1flbjpnw0y3` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `note_tags`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `note_tags` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `note_id` bigint NOT NULL,
  `tag_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_note_tags_note_tag` (`note_id`,`tag_id`),
  KEY `FK8babdwu6uqiu4rdkeuy8dkna0` (`tag_id`),
  CONSTRAINT `FK8babdwu6uqiu4rdkeuy8dkna0` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`),
  CONSTRAINT `FKb15yxop81senc5xs5tjrsy4k4` FOREIGN KEY (`note_id`) REFERENCES `notes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notes`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `bookmark_count` bigint NOT NULL DEFAULT '0',
  `category` enum('DESIGN','DEVELOPMENT','LIFE','MARKETING','OTHER','PLANNING') NOT NULL,
  `content` text NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `like_count` bigint NOT NULL DEFAULT '0',
  `title` varchar(100) NOT NULL,
  `view_count` bigint NOT NULL DEFAULT '0',
  `story_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `popularity_score` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_note_category` (`category`),
  KEY `idx_note_view_count` (`view_count`),
  KEY `idx_note_like_count` (`like_count`),
  KEY `idx_note_created_at` (`created_at`),
  KEY `FK9yx1roo78wsdvgmmecdsbh3mt` (`story_id`),
  KEY `FKechaouoa6kus6k1dpix1u91c` (`user_id`),
  KEY `idx_note_trending` (`created_at` DESC,`popularity_score` DESC),
  CONSTRAINT `FK9yx1roo78wsdvgmmecdsbh3mt` FOREIGN KEY (`story_id`) REFERENCES `stories` (`id`),
  CONSTRAINT `FKechaouoa6kus6k1dpix1u91c` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `refresh_tokens`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_date` datetime(6) NOT NULL,
  `token_value` varchar(255) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKhmdkvh9280etl7ds54h583atd` (`token_value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stories`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `bookmark_count` bigint NOT NULL DEFAULT '0',
  `category` enum('DESIGN','DEVELOPMENT','LIFE','MARKETING','OTHER','PLANNING') NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `description` text,
  `icon` varchar(255) DEFAULT NULL,
  `like_count` bigint NOT NULL DEFAULT '0',
  `title` varchar(100) NOT NULL,
  `view_count` bigint NOT NULL DEFAULT '0',
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_story_category` (`category`),
  KEY `idx_story_like_count` (`like_count`),
  KEY `idx_story_created_at` (`created_at`),
  KEY `FKshv2ytgbsn9w9mpu43mc6ln6j` (`user_id`),
  CONSTRAINT `FKshv2ytgbsn9w9mpu43mc6ln6j` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `story_bookmarks`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `story_bookmarks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `story_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK7ch5dahmpbfq0ba2gy9336t8r` (`user_id`,`story_id`),
  KEY `FK2a4eers5txcli5o26jhb96gj4` (`story_id`),
  CONSTRAINT `FK1a7dlo1nfje62hnm2ytloemeu` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK2a4eers5txcli5o26jhb96gj4` FOREIGN KEY (`story_id`) REFERENCES `stories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `story_likes`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `story_likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `story_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6gsqv7cnk1vevgocgg9tppdo3` (`user_id`,`story_id`),
  KEY `FKa8fytw09g74d1n80nbn6clbt8` (`story_id`),
  CONSTRAINT `FKa8fytw09g74d1n80nbn6clbt8` FOREIGN KEY (`story_id`) REFERENCES `stories` (`id`),
  CONSTRAINT `FKo2p5ura3qbwbn1lb46om8en1w` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tags`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKt48xdq560gs3gap9g7jg36kgc` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `nickname` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `provider_type` enum('EMAIL','GOOGLE') NOT NULL,
  `bio` text,
  `github_url` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-29  1:58:39

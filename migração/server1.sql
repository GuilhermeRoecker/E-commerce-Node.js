-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: 3a-prova-web-2
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

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
-- Table structure for table `carrinho`
--

DROP TABLE IF EXISTS `carrinho`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrinho` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pessoaId` int DEFAULT NULL,
  `dataCriacao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pessoaId` (`pessoaId`),
  CONSTRAINT `carrinho_ibfk_1` FOREIGN KEY (`pessoaId`) REFERENCES `pessoa` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrinho`
--

LOCK TABLES `carrinho` WRITE;
/*!40000 ALTER TABLE `carrinho` DISABLE KEYS */;
INSERT INTO `carrinho` VALUES (1,1,'2025-06-25 07:00:00'),(2,2,'2025-06-25 10:12:04');
/*!40000 ALTER TABLE `carrinho` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carrinhoitem`
--

DROP TABLE IF EXISTS `carrinhoitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrinhoitem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `carrinhoId` int DEFAULT NULL,
  `produtoId` int DEFAULT NULL,
  `quantidade` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `carrinhoId` (`carrinhoId`),
  KEY `produtoId` (`produtoId`),
  CONSTRAINT `carrinhoitem_ibfk_1` FOREIGN KEY (`carrinhoId`) REFERENCES `carrinho` (`id`),
  CONSTRAINT `carrinhoitem_ibfk_2` FOREIGN KEY (`produtoId`) REFERENCES `produto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrinhoitem`
--

LOCK TABLES `carrinhoitem` WRITE;
/*!40000 ALTER TABLE `carrinhoitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `carrinhoitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoriaproduto`
--

DROP TABLE IF EXISTS `categoriaproduto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoriaproduto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoriaproduto`
--

LOCK TABLES `categoriaproduto` WRITE;
/*!40000 ALTER TABLE `categoriaproduto` DISABLE KEYS */;
INSERT INTO `categoriaproduto` VALUES (1,'Roupas','Categoria de roupas em geral'),(2,'Perfumes','Perfumaria em Geral'),(3,'Joias','Joalheiria em Geral'),(4,'Movel','Moveis em geral');
/*!40000 ALTER TABLE `categoriaproduto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `controleacesso`
--

DROP TABLE IF EXISTS `controleacesso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `controleacesso` (
  `pessoaId` int NOT NULL,
  `dataCriacaoConta` datetime DEFAULT CURRENT_TIMESTAMP,
  `ultimoLogin` datetime DEFAULT NULL,
  `statusConta` enum('ATIVO','INATIVO','SUSPENSO') DEFAULT 'ATIVO',
  PRIMARY KEY (`pessoaId`),
  CONSTRAINT `controleacesso_ibfk_1` FOREIGN KEY (`pessoaId`) REFERENCES `pessoa` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `controleacesso`
--

LOCK TABLES `controleacesso` WRITE;
/*!40000 ALTER TABLE `controleacesso` DISABLE KEYS */;
/*!40000 ALTER TABLE `controleacesso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cupom`
--

DROP TABLE IF EXISTS `cupom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cupom` (
  `id` varchar(45) NOT NULL,
  `codigo` varchar(50) NOT NULL,
  `descricao` text,
  `tipo` enum('GERAL','EXCLUSIVO') NOT NULL,
  `desconto` decimal(10,2) NOT NULL,
  `percentual` tinyint(1) DEFAULT '1',
  `data_expiracao` datetime DEFAULT NULL,
  `limite_uso` int DEFAULT NULL,
  `usos_total` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cupom`
--

LOCK TABLES `cupom` WRITE;
/*!40000 ALTER TABLE `cupom` DISABLE KEYS */;
/*!40000 ALTER TABLE `cupom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresa`
--

DROP TABLE IF EXISTS `empresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresa` (
  `razaoSocial` varchar(255) NOT NULL,
  `nomeFantasia` varchar(255) DEFAULT NULL,
  `inscricaoEstadual` varchar(50) DEFAULT NULL,
  `site` varchar(255) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresa`
--

LOCK TABLES `empresa` WRITE;
/*!40000 ALTER TABLE `empresa` DISABLE KEYS */;
INSERT INTO `empresa` VALUES ('Arome','Arome','523414','https://arome.com.br',1),('Roupas','Roupas','Roupas','https://roupas.com.br',10),('Joias','Joias','Joias','https://joias.com.br',15),('Perfumes','Perfumes','Perfumes','https://Perfumes.com.br',16),('Movel','Movel','Movel','https://Movel.com.br',17);
/*!40000 ALTER TABLE `empresa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `endereco`
--

DROP TABLE IF EXISTS `endereco`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `endereco` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pessoaId` int DEFAULT NULL,
  `rua` varchar(255) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `complemento` varchar(255) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `CEP` varchar(20) DEFAULT NULL,
  `empresaId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pessoaId` (`pessoaId`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `endereco`
--

LOCK TABLES `endereco` WRITE;
/*!40000 ALTER TABLE `endereco` DISABLE KEYS */;
INSERT INTO `endereco` VALUES (12,9,'Gabriel Heidmann','1445','Predio','Braco do Norte','Santa Catarina','88750-000',NULL),(13,10,'teste','123','TESTE','TESTE','TESTE','88750-000',NULL),(14,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,NULL,'test2','test2','test2','test2','test2','test2',NULL),(17,NULL,'test3','test3','test3','test3','test3','test3',14),(19,4,'teste','teste','teste','teste','teste','teste',NULL),(20,NULL,'roupas da silva','530','Centro','Braco do Norte','Santa Catarina','88750-000',10),(21,NULL,'Joias','897','Centro','Braco do Norte','Santa Catarina','88750-000',15),(22,NULL,'Perfumes','149','Centro','Braco do Norte','Santa Catarina','88750-000',16),(23,NULL,'Movel','518','Centro','Braco do Norte','Santa Catarina','88750-000',17);
/*!40000 ALTER TABLE `endereco` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrega`
--

DROP TABLE IF EXISTS `entrega`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entrega` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedidoId` int DEFAULT NULL,
  `enderecoEntregaId` int DEFAULT NULL,
  `transportadora` varchar(100) DEFAULT NULL,
  `codigoRastreamento` varchar(100) DEFAULT NULL,
  `status` enum('PENDENTE','EM_TRANSITO','ENTREGUE','FALHOU') DEFAULT 'PENDENTE',
  `dataEnvio` datetime DEFAULT NULL,
  `dataEntrega` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pedidoId` (`pedidoId`),
  KEY `enderecoEntregaId` (`enderecoEntregaId`),
  CONSTRAINT `entrega_ibfk_1` FOREIGN KEY (`pedidoId`) REFERENCES `pedido` (`id`),
  CONSTRAINT `entrega_ibfk_2` FOREIGN KEY (`enderecoEntregaId`) REFERENCES `endereco` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrega`
--

LOCK TABLES `entrega` WRITE;
/*!40000 ALTER TABLE `entrega` DISABLE KEYS */;
/*!40000 ALTER TABLE `entrega` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itempedido`
--

DROP TABLE IF EXISTS `itempedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itempedido` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedidoId` int DEFAULT NULL,
  `produtoId` int DEFAULT NULL,
  `quantidade` int NOT NULL,
  `precoUnitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pedidoId` (`pedidoId`),
  KEY `produtoId` (`produtoId`),
  CONSTRAINT `itempedido_ibfk_1` FOREIGN KEY (`pedidoId`) REFERENCES `pedido` (`id`),
  CONSTRAINT `itempedido_ibfk_2` FOREIGN KEY (`produtoId`) REFERENCES `produto` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itempedido`
--

LOCK TABLES `itempedido` WRITE;
/*!40000 ALTER TABLE `itempedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `itempedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagamento`
--

DROP TABLE IF EXISTS `pagamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagamento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedidoId` int DEFAULT NULL,
  `forma` enum('CARTAO','BOLETO','PIX') NOT NULL,
  `status` enum('AGUARDANDO','PAGO','FALHOU') DEFAULT 'AGUARDANDO',
  `dataPagamento` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pedidoId` (`pedidoId`),
  CONSTRAINT `pagamento_ibfk_1` FOREIGN KEY (`pedidoId`) REFERENCES `pedido` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagamento`
--

LOCK TABLES `pagamento` WRITE;
/*!40000 ALTER TABLE `pagamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `pagamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pessoaId` int DEFAULT NULL,
  `dataPedido` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('PENDENTE','PAGO','ENVIADO','ENTREGUE','CANCELADO') DEFAULT 'PENDENTE',
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pessoaId` (`pessoaId`),
  CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`pessoaId`) REFERENCES `pessoa` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pessoa`
--

DROP TABLE IF EXISTS `pessoa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pessoa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nomeCompleto` varchar(255) NOT NULL,
  `dataNascimento` date DEFAULT NULL,
  `CPF_CNPJ` varchar(20) NOT NULL,
  `nomeDeUsuario` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senhaHash` varchar(255) NOT NULL,
  `tipoPessoa` enum('FISICA','JURIDICA') NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `cargo` varchar(45) DEFAULT NULL,
  `empresaId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `CPF_CNPJ` (`CPF_CNPJ`),
  UNIQUE KEY `nomeDeUsuario` (`nomeDeUsuario`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pessoa`
--

LOCK TABLES `pessoa` WRITE;
/*!40000 ALTER TABLE `pessoa` DISABLE KEYS */;
INSERT INTO `pessoa` VALUES (1,'Guilherme Roecker','2003-03-05','11921558903','guilhermeroecker','guilhermeroecker@mkm.net.br','$2b$10$P/94bQkh7N.SK2zbgaGB3uoxuaQB1.Ltkl2MPJcf797DW9IKAMXli','FISICA','48999222779','48999222779','admin',1),(2,'roupas','2000-01-01','690.488.170-48','roupas','roupas@gmail.com','$2b$10$p0tpsLVfiTpAkllHlCmgGuM.U7MCXh3gkCtgEqa8xUhRsntJ2hL/u','FISICA','36584115','36584115','dono-loja',10),(4,'roupas2','2000-01-01','211.031.660-85','roupas2','roupas2@gmail.com','$2b$10$3VRDRAEcZJ9UT.lzYFutROqkbE6qZDrBtiIu7Vpg0RW07/e.Oxa/O','FISICA','36584115','36584115','vendedor',10),(8,'movel','2000-01-01','464.213.250-33','movel','movel@gmail.com','$2b$10$Edag1YCS0UGIRoKbC7yymefHa9iyPEbVtx2QevNsKSVZ9h8pgopFS','FISICA','movel','movel','dono-loja',17),(10,'movel2','2000-01-01','039.260.250-42','movel2','movel2@gmail.com','$2b$10$GmYZl1R1SXeGpImmlLi4LudHseu39ojLBHKgB1q7sJ0pbo3DF4HPW','FISICA','movel2','movel2','vendedor',17),(11,'Joia','2000-01-01','603.475.490-98','Joia','joia@gmail.com','$2b$10$OeihsoaaNhYdlpEmiy84vOdYBfMsMJLUS2UqQy8Y6G.HQj2h9rv4q','FISICA','Joia','Joia','dono-loja',15),(12,'joia2','2000-01-01','019.897.070-68','joia2','joia2@gmail.com','$2b$10$UPq1zQRpe9Jz2LhiZ4pYae3Tg0VhIf.C1ThAG5fsFDfhWzO71IBkC','FISICA','joia2','joia2','vendedor',15),(13,'Perfume','2000-01-01','309.011.390-25','Perfume','perfume@gmail.com','$2b$10$bERR3QRt1YM25nUEN8wex.2NAiqZkeEOwq48PC4MsnQ9.O0R3z82O','FISICA','Perfume','Perfume','dono-loja',16),(14,'Perfume2','2000-01-01','233.205.980-66','Perfume2','perfume2@gmail.com','$2b$10$1gcwyILBt4wHVR0R6s98z.fwKGPhwGaat1/T9fwPagdUq2mnHq6NS','FISICA','Perfume2','Perfume2','vendedor',16),(15,'Cliente','2005-03-01','789.219.970-59','Cliente','guilherme.roecker@outlook.com.br','$2b$10$xz7.s2RS6GO2jw9QYY9IHOloN23geVI1eRKvYE2CkUQyuVoXvkUNW','FISICA','48999222779','48999222779','cliente',NULL);
/*!40000 ALTER TABLE `pessoa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produto`
--

DROP TABLE IF EXISTS `produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `descricao` text,
  `preco` decimal(10,2) NOT NULL,
  `estoque` int NOT NULL,
  `empresaId` int DEFAULT NULL,
  `categoriaId` int DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `empresaId` (`empresaId`),
  KEY `categoriaId` (`categoriaId`),
  CONSTRAINT `produto_ibfk_2` FOREIGN KEY (`categoriaId`) REFERENCES `categoriaproduto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produto`
--

LOCK TABLES `produto` WRITE;
/*!40000 ALTER TABLE `produto` DISABLE KEYS */;
INSERT INTO `produto` VALUES (17,'Camisa','Camisa Azul',20.00,100,10,1,1),(18,'Camisa Preta','Camisa basica preta',15.00,100,10,1,1),(19,' Malbec Ultra Bleu ',' Malbec Ultra Bleu Desodorante Colônia 100ml ',199.90,200,16,2,1),(20,'Essencial Atrai','Essencial Atrai Feminino 100 ml',177.90,200,16,2,1),(21,'Aparador Buffet','Aparador Buffet 3 Portas Berlin Vianossa',341.90,50,17,4,1),(24,'Multiuso Organizador','Multiuso Organizador Para Escritório 2 Portas E 2 Divisórias',240.00,10,17,4,1),(25,'Colar Esterlina',' Colar Encanto Azul em Prata 925 Esterlina 45cm',199.90,10,15,3,1),(26,'Anel de ouro','Anel de ouro aro duplo coração brilhante',1955.90,5,15,3,1);
/*!40000 ALTER TABLE `produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produtoimagem`
--

DROP TABLE IF EXISTS `produtoimagem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtoimagem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `produtoId` int DEFAULT NULL,
  `url` varchar(500) NOT NULL,
  `legenda` varchar(255) DEFAULT NULL,
  `ordem` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `produtoId` (`produtoId`),
  CONSTRAINT `produtoimagem_ibfk_1` FOREIGN KEY (`produtoId`) REFERENCES `produto` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtoimagem`
--

LOCK TABLES `produtoimagem` WRITE;
/*!40000 ALTER TABLE `produtoimagem` DISABLE KEYS */;
INSERT INTO `produtoimagem` VALUES (15,17,'/uploads/1750763640227-camiseta-azul-royal-para-sublima_o-tradicional_1.jpg',NULL,0),(16,18,'/uploads/1750871598675-shopping.webp',NULL,0),(17,19,'/uploads/1750871937322-Malbec-Blue-3.jpg',NULL,0),(18,20,'/uploads/1750872014625-shopping.webp',NULL,0),(19,21,'/uploads/1750873237681-AparadorBuffet .webp',NULL,0),(21,24,'/uploads/1750873456753-Multiuso.webp',NULL,0),(22,25,'/uploads/1750873575522-colar-encanto-azul-em-prata-925-esterlina-45cm-6065f82d1273b-large.jpg',NULL,0),(23,26,'/uploads/1750873678764-163100C01.png',NULL,0);
/*!40000 ALTER TABLE `produtoimagem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `segurancaconta`
--

DROP TABLE IF EXISTS `segurancaconta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `segurancaconta` (
  `pessoaId` int NOT NULL,
  `emailVerificado` tinyint(1) DEFAULT '0',
  `tokenVerificacaoEmail` varchar(255) DEFAULT NULL,
  `tentativasLoginFalhas` int DEFAULT '0',
  `bloqueadoAte` datetime DEFAULT NULL,
  PRIMARY KEY (`pessoaId`),
  CONSTRAINT `segurancaconta_ibfk_1` FOREIGN KEY (`pessoaId`) REFERENCES `pessoa` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `segurancaconta`
--

LOCK TABLES `segurancaconta` WRITE;
/*!40000 ALTER TABLE `segurancaconta` DISABLE KEYS */;
/*!40000 ALTER TABLE `segurancaconta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_cupom`
--

DROP TABLE IF EXISTS `usuario_cupom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_cupom` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cupom_id` varchar(45) DEFAULT NULL,
  `pessoa_id` int DEFAULT NULL,
  `usado` tinyint(1) DEFAULT '0',
  `data_uso` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cupom_id` (`cupom_id`,`pessoa_id`),
  KEY `pessoa_id` (`pessoa_id`),
  CONSTRAINT `usuario_cupom_ibfk_1` FOREIGN KEY (`cupom_id`) REFERENCES `cupom` (`id`) ON DELETE CASCADE,
  CONSTRAINT `usuario_cupom_ibfk_2` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoa` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_cupom`
--

LOCK TABLES `usuario_cupom` WRITE;
/*!40000 ALTER TABLE `usuario_cupom` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_cupom` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-25 14:51:42

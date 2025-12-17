CREATE TABLE IF NOT EXISTS `sales_rep_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sales_rep_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sales_rep_id` (`sales_rep_id`),
  CONSTRAINT `fk_sales_rep_payment` FOREIGN KEY (`sales_rep_id`) REFERENCES `sales_reps` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

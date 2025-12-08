-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 08, 2025 at 06:08 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `marybill_conglomeratedb`
--

-- --------------------------------------------------------

--
-- Table structure for table `assets`
--

CREATE TABLE `assets` (
  `asset_id` char(36) NOT NULL DEFAULT uuid(),
  `asset_name` varchar(255) NOT NULL,
  `asset_category` varchar(100) NOT NULL,
  `asset_description` text DEFAULT NULL,
  `purchase_date` date NOT NULL,
  `purchase_price` decimal(15,2) NOT NULL,
  `current_value` decimal(15,2) DEFAULT NULL,
  `asset_condition` varchar(50) NOT NULL,
  `location` varchar(255) NOT NULL,
  `serial_number` varchar(100) DEFAULT NULL,
  `warranty_expiry` date DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assets`
--

INSERT INTO `assets` (`asset_id`, `asset_name`, `asset_category`, `asset_description`, `purchase_date`, `purchase_price`, `current_value`, `asset_condition`, `location`, `serial_number`, `warranty_expiry`, `status`, `created_at`, `updated_at`) VALUES
('f9cbfeaa-d28f-11f0-a399-f8e4e3fe8908', 'Van', 'Vehicles', 'Big van', '2025-12-05', 10000.00, 10000.00, 'Good', 'MARIAN', NULL, '2025-12-12', 'Active', '2025-12-06 10:40:21', '2025-12-06 10:40:21'),
('2dfccab6-d290-11f0-a399-f8e4e3fe8908', 'PC', 'IT Hardware', 'DELL PC', '2025-12-06', 300000.00, 300000.00, 'Poor', 'HEAD OFFICE', 'ddhihw83888', '2025-12-25', 'Under Maintenance', '2025-12-06 10:41:49', '2025-12-06 10:41:49');

-- --------------------------------------------------------

--
-- Table structure for table `branch_sales`
--

CREATE TABLE `branch_sales` (
  `sale_id` char(36) NOT NULL,
  `branch_id` char(36) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_phoneNo` int(11) DEFAULT NULL,
  `total_amount` int(11) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `sale_date` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `branch_stock`
--

CREATE TABLE `branch_stock` (
  `stock_id` char(36) NOT NULL DEFAULT uuid(),
  `branch_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `stock_quantity_wholesale` int(11) NOT NULL,
  `stock_quantity_retail` int(11) NOT NULL,
  `reorder_level` int(11) NOT NULL DEFAULT 10,
  `date_added` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modified` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','delivered') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chart_of_accounts`
--

CREATE TABLE `chart_of_accounts` (
  `account_code` varchar(20) NOT NULL,
  `account_name` varchar(255) NOT NULL,
  `account_type` enum('ASSET','LIABILITY','EQUITY','REVENUE','EXPENSE') NOT NULL,
  `parent_account` varchar(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `opening_balance` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chart_of_accounts`
--

INSERT INTO `chart_of_accounts` (`account_code`, `account_name`, `account_type`, `parent_account`, `description`, `is_active`, `opening_balance`, `created_at`, `updated_at`) VALUES
('1000', 'Cash', 'ASSET', NULL, 'Cash on hand and in bank', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('1100', 'Accounts Receivable', 'ASSET', NULL, 'Money owed by customers', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('1200', 'Inventory', 'ASSET', NULL, 'Stock of goods for sale', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('1300', 'Prepaid Expenses', 'ASSET', NULL, 'Expenses paid in advance', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('1400', 'Fixed Assets', 'ASSET', NULL, 'Long-term tangible assets', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('1410', 'Equipment', 'ASSET', NULL, 'Business equipment and machinery', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('1420', 'Furniture & Fixtures', 'ASSET', NULL, 'Office furniture and fixtures', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('1430', 'Vehicles', 'ASSET', NULL, 'Company vehicles', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('1500', 'Accumulated Depreciation', 'ASSET', NULL, 'Contra-asset account for depreciation', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('1600', 'Petty Cash', 'REVENUE', NULL, NULL, 1, 0.00, '2025-12-08 15:18:49', '2025-12-08 15:18:49'),
('2000', 'Accounts Payable', 'LIABILITY', NULL, 'Money owed to suppliers', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('2100', 'Salaries Payable', 'LIABILITY', NULL, 'Unpaid employee salaries', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('2200', 'Tax Payable', 'LIABILITY', NULL, 'Taxes owed to government', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('2210', 'Sales Tax Payable', 'LIABILITY', NULL, 'Sales tax collected from customers', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('2220', 'Income Tax Payable', 'LIABILITY', NULL, 'Income tax owed', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('2300', 'Loans Payable', 'LIABILITY', NULL, 'Bank loans and other borrowings', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('2400', 'Accrued Expenses', 'LIABILITY', NULL, 'Expenses incurred but not yet paid', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('3000', 'Owner\'s Capital', 'EQUITY', NULL, 'Owner\'s investment in business', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('3100', 'Retained Earnings', 'EQUITY', NULL, 'Accumulated profits', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('3200', 'Drawings', 'EQUITY', NULL, 'Owner\'s withdrawals', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('4000', 'Sales Revenue', 'REVENUE', NULL, 'Revenue from product sales', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('4100', 'Service Revenue', 'REVENUE', NULL, 'Revenue from services', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('4200', 'Other Income', 'REVENUE', NULL, 'Miscellaneous income', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('4300', 'Interest Income', 'REVENUE', NULL, 'Interest earned on deposits', 1, 0.00, '2025-12-06 16:31:29', '2025-12-06 16:31:29'),
('5000', 'Cost of Goods Sold', 'EXPENSE', NULL, 'Direct cost of products sold', 1, 0.00, '2025-12-06 16:31:30', '2025-12-06 16:31:30'),
('5100', 'Salary Expense', 'EXPENSE', NULL, 'Employee salaries and wages', 1, 0.00, '2025-12-06 16:31:30', '2025-12-06 16:31:30'),
('5200', 'Rent Expense', 'EXPENSE', NULL, 'Rent for business premises', 1, 0.00, '2025-12-06 16:31:30', '2025-12-06 16:31:30'),
('5300', 'Utilities Expense', 'EXPENSE', NULL, 'Electricity, water, internet', 1, 0.00, '2025-12-06 16:31:30', '2025-12-06 16:31:30'),
('5400', 'Office Supplies Expense', 'EXPENSE', NULL, 'Office supplies and materials', 1, 0.00, '2025-12-06 16:31:30', '2025-12-06 16:31:30'),
('5500', 'Depreciation Expense', 'EXPENSE', NULL, 'Depreciation of fixed assets', 1, 0.00, '2025-12-06 16:31:30', '2025-12-06 16:31:30'),
('5600', 'Insurance Expense', 'EXPENSE', NULL, 'Business insurance premiums', 1, 0.00, '2025-12-06 16:31:30', '2025-12-06 16:31:30'),
('5700', 'Marketing Expense', 'EXPENSE', NULL, 'Advertising and marketing costs', 1, 0.00, '2025-12-06 16:31:30', '2025-12-06 16:31:30'),
('5800', 'Bank Charges', 'EXPENSE', NULL, 'Bank fees and charges', 1, 0.00, '2025-12-06 16:31:30', '2025-12-06 16:31:30'),
('5900', 'Miscellaneous Expense', 'EXPENSE', NULL, 'Other operating expenses', 1, 0.00, '2025-12-06 16:31:30', '2025-12-06 16:31:30');

-- --------------------------------------------------------

--
-- Table structure for table `ledger_entries`
--

CREATE TABLE `ledger_entries` (
  `entry_id` varchar(50) NOT NULL,
  `transaction_id` varchar(50) NOT NULL,
  `account_code` varchar(20) NOT NULL,
  `entry_type` enum('DEBIT','CREDIT') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text DEFAULT NULL,
  `entry_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ledger_transactions`
--

CREATE TABLE `ledger_transactions` (
  `transaction_id` varchar(50) NOT NULL,
  `transaction_date` date NOT NULL,
  `transaction_type` varchar(20) NOT NULL,
  `reference_number` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `status` enum('DRAFT','POSTED','VOID') DEFAULT 'POSTED',
  `created_by` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `posted_at` timestamp NULL DEFAULT NULL,
  `voided_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payroll`
--

CREATE TABLE `payroll` (
  `payroll_id` char(36) NOT NULL DEFAULT uuid(),
  `staff_name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text DEFAULT NULL,
  `salary` decimal(12,2) NOT NULL,
  `level` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` char(36) NOT NULL DEFAULT uuid(),
  `product_name` varchar(200) NOT NULL,
  `wholesale_cost_price` float NOT NULL,
  `wholesale_selling_price` float NOT NULL,
  `retail_cost_price` float NOT NULL,
  `retail_selling_price` float NOT NULL,
  `supplier_id` char(36) NOT NULL,
  `category` text NOT NULL,
  `date_added` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modified` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `wholesale_cost_price`, `wholesale_selling_price`, `retail_cost_price`, `retail_selling_price`, `supplier_id`, `category`, `date_added`, `date_modified`) VALUES
('05cc4f41-7919-11f0-8ff9-bc2412b8fc93', 'CRATE - GENERIC YELLOW 18X450ml', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cc5572-7919-11f0-8ff9-bc2412b8fc93', 'CRATE - GENERIC YELLOW 24X330ml', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cc5661-7919-11f0-8ff9-bc2412b8fc93', 'CRATE - SMIRNOF  GENERIC YELLOW 24X330ml', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cc5902-7919-11f0-8ff9-bc2412b8fc93', 'CRATE - MALTA GUINNESS BLACK 24X330ml', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cc5991-7919-11f0-8ff9-bc2412b8fc93', 'BOTTLE - MALTA GUINNESS 330ML', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cc5a0b-7919-11f0-8ff9-bc2412b8fc93', 'BOTTLE - FES/GES 330ml', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cc5b00-7919-11f0-8ff9-bc2412b8fc93', 'BOTTLE - GUINNESS FES/GES 450ml', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cc5bd6-7919-11f0-8ff9-bc2412b8fc93', 'BOTTLE - GUINNESS FES/GES 600ml', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cc5c57-7919-11f0-8ff9-bc2412b8fc93', 'BOTTLE - SMIRNOF ICE 300ML', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cc5cdb-7919-11f0-8ff9-bc2412b8fc93', 'BOTTLE - DUBIC LAGER/ORIJIN RTD 600ML', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cc5d51-7919-11f0-8ff9-bc2412b8fc93', 'BOTTLE - SMIRNOFF ICE 600ML', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cc5da7-7919-11f0-8ff9-bc2412b8fc93', 'BOTTLE - 300ml DUBIC MALT', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cc5df4-7919-11f0-8ff9-bc2412b8fc93', 'GUINNESS FES 600ml RET 12X1(Large)', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cc5e4c-7919-11f0-8ff9-bc2412b8fc93', 'GUINNESS FES 325ml RET 24X1(Small)', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05ccdda8-7919-11f0-8ff9-bc2412b8fc93', 'GUINNESS FES 450ml RET 18X1(Medium)', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cce16f-7919-11f0-8ff9-bc2412b8fc93', 'GUINNESS FES 330ml CAN 24X1', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cce1ea-7919-11f0-8ff9-bc2412b8fc93', 'MALTA GUINNESS 330ML RET 24X01', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cce24e-7919-11f0-8ff9-bc2412b8fc93', 'MALTA GUINNESS CAN 330ML 24X01', 11639, 12000, 11639, 12000, '7', 'Drinks', '2025-08-14 14:15:08', '2025-09-22 14:36:14'),
('05cce322-7919-11f0-8ff9-bc2412b8fc93', 'SMIRNOFF ICE 330ML 24X01', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cce398-7919-11f0-8ff9-bc2412b8fc93', 'BAILEYS ORIGINAL 70cl 12X1', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cce3eb-7919-11f0-8ff9-bc2412b8fc93', 'ORIGIN BITTERS 75cl 6X1', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cce442-7919-11f0-8ff9-bc2412b8fc93', 'ORIJIN BITTERS 20cl 24X1', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cce499-7919-11f0-8ff9-bc2412b8fc93', 'SMIRNOFF ICE 600ML 12X01', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cce50a-7919-11f0-8ff9-bc2412b8fc93', 'ORIJIN 600ML RET 12X01', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cce57e-7919-11f0-8ff9-bc2412b8fc93', 'DUBIC MALT in CA 330ml CAN 24X1', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd320c-7919-11f0-8ff9-bc2412b8fc93', 'SMIR X1 I CHOCO 18cl 48X1', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd339b-7919-11f0-8ff9-bc2412b8fc93', 'SMIR X1 I CHOCO 75cl 12X1 5 YO', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd3435-7919-11f0-8ff9-bc2412b8fc93', 'GORDONS DRY GMC 75ml 12X1 5 YO', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd34ae-7919-11f0-8ff9-bc2412b8fc93', 'GORDON DRY GMC 18cl 48X1', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd350f-7919-11f0-8ff9-bc2412b8fc93', 'JW RED 70cl 12X1', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd3561-7919-11f0-8ff9-bc2412b8fc93', 'DUBIC MALT 300ml RET 24X1 Monarch', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd35b7-7919-11f0-8ff9-bc2412b8fc93', 'DUBIC MALT  IN PET 330ML PET 06X04', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd3602-7919-11f0-8ff9-bc2412b8fc93', 'DUBIC MALT in PE 330ml PET 12x1', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd3656-7919-11f0-8ff9-bc2412b8fc93', 'MALTA GUINNESS PET 330ML 12x01', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd36c7-7919-11f0-8ff9-bc2412b8fc93', 'MALTA GUINNESS IN PET 330ML PET 06X04', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd3738-7919-11f0-8ff9-bc2412b8fc93', 'ORIGIN BITTERS 5cl 20X6', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd37a1-7919-11f0-8ff9-bc2412b8fc93', 'Mr.Dowells Whisky 12x750ml', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd3805-7919-11f0-8ff9-bc2412b8fc93', 'Mr.Dowells Whisky 48X180ml', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd3866-7919-11f0-8ff9-bc2412b8fc93', 'GUINNESS SMOOTH 450ml RET 18X1', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd38d5-7919-11f0-8ff9-bc2412b8fc93', 'JW BLACK 70cl 12Y 12X1', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd394c-7919-11f0-8ff9-bc2412b8fc93', 'GUINNESS SMOOTH 330ML CAN 24X01', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd39a1-7919-11f0-8ff9-bc2412b8fc93', 'ORIJIN TIGERNUT & GIN 330ML CAN 24X01', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd39f0-7919-11f0-8ff9-bc2412b8fc93', 'ORIJIN TIGERNUT & GIN 600ML RET 12X01', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('05cd3a3a-7919-11f0-8ff9-bc2412b8fc93', 'SMIRNOFF IDB & GUARANA CAN 330ML 24X01', 0, 0, 0, 0, '7', 'Drinks', '2025-08-14 14:15:08', '2025-08-14 14:15:08'),
('09602feb-7d0b-11f0-8ff9-bc2412b8fc93', 'Krim crackers', 5000, 6500, 200, 250, '5', 'Snacks', '2025-08-19 14:45:25', '2025-08-19 14:53:51'),
('101d1e4f-7919-11f0-8ff9-bc2412b8fc93', 'JOS TOMATO PASTE 55g', 5400, 5600, 5400, 5700, '8', 'JOS TOMATO PASTE', '2025-08-14 14:15:26', '2025-11-19 14:06:12'),
('1ab51538-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA SHOWER CREME SOFT 500ML 6X2', 0, 0, 0, 0, '2', 'Nivea Shower Gel', '2025-08-14 14:08:34', '2025-08-14 14:08:34'),
('1ab51cca-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA SHOWER FRESH POWERFRUIT 500ml 6X2', 0, 0, 0, 0, '2', 'Nivea Shower Gel', '2025-08-14 14:08:34', '2025-08-14 14:08:34'),
('1ab51d9f-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA MEN SHOWER COOL KICK 500ml 6X2', 0, 0, 0, 0, '2', 'Nivea Shower Gel', '2025-08-14 14:08:34', '2025-08-14 14:08:34'),
('1ab51e7d-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA MEN SHOWER DEEP 500ml (6x2)', 0, 0, 0, 0, '2', 'Nivea Shower Gel', '2025-08-14 14:08:34', '2025-08-14 14:08:34'),
('1ab52005-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA SHOWER FRESH ALOE 500ml (6x2)', 0, 0, 0, 0, '2', 'Nivea Shower Gel', '2025-08-14 14:08:34', '2025-08-14 14:08:34'),
('1ab520c9-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA SHOWER DIAMOND & ARGAN OIL 500ml (6x2)', 0, 0, 0, 0, '2', 'Nivea Shower Gel', '2025-08-14 14:08:34', '2025-08-14 14:08:34'),
('1ab5215b-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA SHOWER ORANGE & AVOCADO 500ml (6x2)', 0, 0, 0, 0, '2', 'Nivea Shower Gel', '2025-08-14 14:08:34', '2025-08-14 14:08:34'),
('1af216a4-7919-11f0-8ff9-bc2412b8fc93', 'KING\'S OIL 25L', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af21dd8-7919-11f0-8ff9-bc2412b8fc93', 'KING\'S OIL 10L', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af21ee2-7919-11f0-8ff9-bc2412b8fc93', 'KING;S OIL 5L X4', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af21f4f-7919-11f0-8ff9-bc2412b8fc93', 'KING\'S OIL 3L X6', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af21fad-7919-11f0-8ff9-bc2412b8fc93', 'KING\'S OIL 2L X6', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af22003-7919-11f0-8ff9-bc2412b8fc93', 'KING\'S OIL 1L X12', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af22049-7919-11f0-8ff9-bc2412b8fc93', 'KING\'S OIL 1000ML X12', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af22094-7919-11f0-8ff9-bc2412b8fc93', 'KING\'S OIL 750ML X12', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af220db-7919-11f0-8ff9-bc2412b8fc93', 'KING\'S OIL 500ML X20', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af22127-7919-11f0-8ff9-bc2412b8fc93', 'KING\'S OIL 250G X36', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af22173-7919-11f0-8ff9-bc2412b8fc93', 'KING\'S OIL 250G X 60', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af221bf-7919-11f0-8ff9-bc2412b8fc93', 'KING\'S OIL 90ML X60', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af2220e-7919-11f0-8ff9-bc2412b8fc93', 'KING\'S OIL 15KG', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af2225a-7919-11f0-8ff9-bc2412b8fc93', 'MAMADOR 3.5L X4', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af2229f-7919-11f0-8ff9-bc2412b8fc93', 'MAMADOR 2.5L X4', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af222e3-7919-11f0-8ff9-bc2412b8fc93', 'MAMADOR 1.5L X6', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af22325-7919-11f0-8ff9-bc2412b8fc93', 'MAMADOR 900ML X12', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af2236b-7919-11f0-8ff9-bc2412b8fc93', 'MAMADOE 500ML X24', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af223ac-7919-11f0-8ff9-bc2412b8fc93', 'MAMADOR 450G X24', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af223f0-7919-11f0-8ff9-bc2412b8fc93', 'MAMADOR 250G X24', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af22434-7919-11f0-8ff9-bc2412b8fc93', 'MAMADOR CLASSIC 5G X144', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af2247c-7919-11f0-8ff9-bc2412b8fc93', 'MAMADOR BEEF 5G X144', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af224be-7919-11f0-8ff9-bc2412b8fc93', 'MAMADOR CHICKEN 5G X144', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('1af22505-7919-11f0-8ff9-bc2412b8fc93', 'MAMADOR 40ml x 100', 0, 0, 0, 0, '9', 'OIL', '2025-08-14 14:15:44', '2025-08-14 14:15:44'),
('267feb1c-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA AFTER SHAVE REPLENISHING BALM (BALM PROTECT) 100ML 6X4', 0, 0, 0, 0, '2', 'Nivea Aftershave Balm', '2025-08-14 14:08:54', '2025-08-14 14:08:54'),
('267ff15a-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA AFTER SHAVE SENSITIVE BALM 100ML 6X4', 0, 0, 0, 0, '2', 'Nivea Aftershave Balm', '2025-08-14 14:08:54', '2025-08-14 14:08:54'),
('267ff308-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA MEN AFTER SHAVE FLUID FRESH & COOL 100ml 6X4', 0, 0, 0, 0, '2', 'Nivea Aftershave Balm', '2025-08-14 14:08:54', '2025-08-14 14:08:54'),
('267ff378-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA SHAVING FOAM MOISTURIZING 200ML 6X4', 0, 0, 0, 0, '2', 'Nivea Aftershave Balm', '2025-08-14 14:08:54', '2025-08-14 14:08:54'),
('267ff3da-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA SHAVING FOAM SENSITIVE 200ML 6X4', 0, 0, 0, 0, '2', 'Nivea Aftershave Balm', '2025-08-14 14:08:54', '2025-08-14 14:08:54'),
('267ff434-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA AFTER SHAVE ENERGISING FLUID 100ml 6X4', 0, 0, 0, 0, '2', 'Nivea Aftershave Balm', '2025-08-14 14:08:54', '2025-08-14 14:08:54'),
('2cc6240b-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA SPRAY FRESH FEMALE 200ml (6X2)', 0, 0, 0, 0, '2', 'Nivea Body Spray', '2025-08-14 14:09:04', '2025-08-14 14:09:04'),
('2cc629db-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA SPRAY COOL KICK 200ml (6X2)', 0, 0, 0, 0, '2', 'Nivea Body Spray', '2025-08-14 14:09:04', '2025-08-14 14:09:04'),
('2cc62aa5-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA SPRAY INVISIBLE BLACK & WHITE FEMALE 200ml (6X2)', 0, 0, 0, 0, '2', 'Nivea Body Spray', '2025-08-14 14:09:04', '2025-08-14 14:09:04'),
('2cc62b98-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA SPRAY FRESH NATURAL 200ml (6X2)', 0, 0, 0, 0, '2', 'Nivea Body Spray', '2025-08-14 14:09:04', '2025-08-14 14:09:04'),
('2cc62d21-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA SPRAY INVISIBLE BLACK & WHITE MALE 200ml (6X2)', 0, 0, 0, 0, '2', 'Nivea Body Spray', '2025-08-14 14:09:04', '2025-08-14 14:09:04'),
('2cc62dcc-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA SPRAY PEARL & BEAUTY 200ml (6X2)', 0, 0, 0, 0, '2', 'Nivea Body Spray', '2025-08-14 14:09:04', '2025-08-14 14:09:04'),
('2cc62e2a-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA SPRAY DEEP MEN 200ml (6X2)', 0, 0, 0, 0, '2', 'Nivea Body Spray', '2025-08-14 14:09:04', '2025-08-14 14:09:04'),
('2cc6bbc8-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA SPRAY SILVER PROTECT 200ml (6X2)', 0, 0, 0, 0, '2', 'Nivea Body Spray', '2025-08-14 14:09:04', '2025-08-14 14:09:04'),
('2cc6bd64-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA MEN SPRAY DRY IMPACT 200ml (6X2)', 0, 0, 0, 0, '2', 'Nivea Body Spray', '2025-08-14 14:09:04', '2025-08-14 14:09:04'),
('2cc6bf20-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA MEN SPRAY DRY FRESH MALE 200ml (6X2)', 0, 0, 0, 0, '2', 'Nivea Body Spray', '2025-08-14 14:09:04', '2025-08-14 14:09:04'),
('2cc6bfcf-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA MEN SPRAY DRY COMFORT 200ml (6X2)', 0, 0, 0, 0, '2', 'Nivea Body Spray', '2025-08-14 14:09:04', '2025-08-14 14:09:04'),
('2cc6c067-7918-11f0-8ff9-bc2412b8fc93', 'NIVEA MEN SPRAY FRESH ACTIVE 200ML (6X2)', 0, 0, 0, 0, '2', 'Nivea Body Spray', '2025-08-14 14:09:04', '2025-08-14 14:09:04'),
('3508d39e-7918-11f0-8ff9-bc2412b8fc93', 'DABUR MISWAK TOOTHPASTE FRESH GEL', 0, 0, 0, 0, '2', 'Dabur', '2025-08-14 14:09:18', '2025-08-14 14:09:18'),
('3508db76-7918-11f0-8ff9-bc2412b8fc93', 'DABUR HERBAL CLOVE 140+FREE 10g 5X10', 0, 0, 0, 0, '2', 'Dabur', '2025-08-14 14:09:18', '2025-08-14 14:09:18'),
('3508dc35-7918-11f0-8ff9-bc2412b8fc93', 'DABUR PROMISE RED GEL', 0, 0, 0, 0, '2', 'Dabur', '2025-08-14 14:09:18', '2025-08-14 14:09:18'),
('3508dce0-7918-11f0-8ff9-bc2412b8fc93', 'DABUR HERBAL TOOTHPASTE GREEN GEL', 0, 0, 0, 0, '2', 'Dabur', '2025-08-14 14:09:18', '2025-08-14 14:09:18'),
('3508dd62-7918-11f0-8ff9-bc2412b8fc93', 'DABUR TOOTHPASTE COMBO PACK 140g 5X10', 0, 0, 0, 0, '2', 'Dabur', '2025-08-14 14:09:18', '2025-08-14 14:09:18'),
('3508dddb-7918-11f0-8ff9-bc2412b8fc93', 'DABUR ODOMOS', 0, 0, 0, 0, '2', 'Dabur', '2025-08-14 14:09:18', '2025-08-14 14:09:18'),
('3508de53-7918-11f0-8ff9-bc2412b8fc93', 'DABUR MEDIMAX HAND SANITIZER', 0, 0, 0, 0, '2', 'Dabur', '2025-08-14 14:09:18', '2025-08-14 14:09:18'),
('3508decc-7918-11f0-8ff9-bc2412b8fc93', 'DABUR GREEN GEL 70g', 0, 0, 0, 0, '2', 'Dabur', '2025-08-14 14:09:18', '2025-08-14 14:09:18'),
('3508df44-7918-11f0-8ff9-bc2412b8fc93', 'DABUR SQUEZZY', 0, 0, 0, 0, '2', 'Dabur', '2025-08-14 14:09:18', '2025-08-14 14:09:18'),
('3508e0eb-7918-11f0-8ff9-bc2412b8fc93', 'DABUR DAZZL 1L', 0, 0, 0, 0, '2', 'Dabur', '2025-08-14 14:09:18', '2025-08-14 14:09:18'),
('3508e168-7918-11f0-8ff9-bc2412b8fc93', 'DABUR HERBAL BASIL 140gm 5X10', 0, 0, 0, 0, '2', 'Dabur', '2025-08-14 14:09:18', '2025-08-14 14:09:18'),
('3cefbb90-7918-11f0-8ff9-bc2412b8fc93', 'ORS CREAM NO LYE KIT 8T NORMAL', 0, 0, 0, 0, '2', 'ORS', '2025-08-14 14:09:31', '2025-08-14 14:09:31'),
('3cefc184-7918-11f0-8ff9-bc2412b8fc93', 'ORS LYE RELAXER KIT 12T 1X4', 0, 0, 0, 0, '2', 'ORS', '2025-08-14 14:09:31', '2025-08-14 14:09:31'),
('3cefc3ae-7918-11f0-8ff9-bc2412b8fc93', 'ORS LYE RELAXER KIT 6T', 0, 0, 0, 0, '2', 'ORS', '2025-08-14 14:09:31', '2025-08-14 14:09:31'),
('3cefc43e-7918-11f0-8ff9-bc2412b8fc93', 'ORS OO Cnc STRETCH TEXTURISER 2TUP', 0, 0, 0, 0, '2', 'ORS', '2025-08-14 14:09:31', '2025-08-14 14:09:31'),
('3cefc4ca-7918-11f0-8ff9-bc2412b8fc93', 'ORS REPLENISHING CONDITIONER 12.25oz', 0, 0, 0, 0, '2', 'ORS', '2025-08-14 14:09:31', '2025-08-14 14:09:31'),
('3cefc54d-7918-11f0-8ff9-bc2412b8fc93', 'ORS SINGLE HEAD KIT-NO-LYE', 0, 0, 0, 0, '2', 'ORS', '2025-08-14 14:09:31', '2025-08-14 14:09:31'),
('3cefc5b8-7918-11f0-8ff9-bc2412b8fc93', 'ORS LOCK AND TWIST GEL 368g (1X12)', 0, 0, 0, 0, '2', 'ORS', '2025-08-14 14:09:31', '2025-08-14 14:09:31'),
('3cefc631-7918-11f0-8ff9-bc2412b8fc93', 'ORS OLIVE OIL NO LYE Rx KIT N.S NG (1X12)', 0, 0, 0, 0, '2', 'ORS', '2025-08-14 14:09:31', '2025-08-14 14:09:31'),
('3cefc6ac-7918-11f0-8ff9-bc2412b8fc93', 'ORS CnCN 12T+ VATIKO AFRO NATURAL REST LEAVE', 0, 0, 0, 0, '2', 'ORS', '2025-08-14 14:09:31', '2025-08-14 14:09:31'),
('3cefc731-7918-11f0-8ff9-bc2412b8fc93', 'ORS CREAMY ALOE SHAMPOO 370ml (1X12)', 0, 0, 0, 0, '2', 'ORS', '2025-08-14 14:09:31', '2025-08-14 14:09:31'),
('3cefc7a6-7918-11f0-8ff9-bc2412b8fc93', 'ORS OLIVE OIL GIRLS 6+1 TOUCH UP 1X4', 0, 0, 0, 0, '2', 'ORS', '2025-08-14 14:09:31', '2025-08-14 14:09:31'),
('435a5aa9-7918-11f0-8ff9-bc2412b8fc93', 'ROMANO BODY SPRAY (ATTITUDE)', 0, 0, 0, 0, '2', 'Unza Romano', '2025-08-14 14:09:42', '2025-08-14 14:09:42'),
('435a6505-7918-11f0-8ff9-bc2412b8fc93', 'ROMANO BODY SPRAY (CLASSIC)', 0, 0, 0, 0, '2', 'Unza Romano', '2025-08-14 14:09:42', '2025-08-14 14:09:42'),
('435a66b6-7918-11f0-8ff9-bc2412b8fc93', 'ROMANO BODY SPRAY (FORCE)', 0, 0, 0, 0, '2', 'Unza Romano', '2025-08-14 14:09:42', '2025-08-14 14:09:42'),
('435a674b-7918-11f0-8ff9-bc2412b8fc93', 'ROMANO AP ROLL ON DEO CLASSIC', 0, 0, 0, 0, '2', 'Unza Romano', '2025-08-14 14:09:42', '2025-08-14 14:09:42'),
('435a67c3-7918-11f0-8ff9-bc2412b8fc93', 'ROMANO AP ROLL ON DEO FORCE', 0, 0, 0, 0, '2', 'Unza Romano', '2025-08-14 14:09:42', '2025-08-14 14:09:42'),
('435a6835-7918-11f0-8ff9-bc2412b8fc93', 'ROMANO AP ROLL ON DEO ATTITUDE', 0, 0, 0, 0, '2', 'Unza Romano', '2025-08-14 14:09:42', '2025-08-14 14:09:42'),
('435a68ab-7918-11f0-8ff9-bc2412b8fc93', 'ROMANO. POCKET EDT 18ml 3X36 CLASSIC', 0, 0, 0, 0, '2', 'Unza Romano', '2025-08-14 14:09:42', '2025-08-14 14:09:42'),
('435a692c-7918-11f0-8ff9-bc2412b8fc93', 'ROMANO. POCKET EDT 18ml 3X36 FORCE', 0, 0, 0, 0, '2', 'Unza Romano', '2025-08-14 14:09:42', '2025-08-14 14:09:42'),
('4ba38f90-7918-11f0-8ff9-bc2412b8fc93', 'DOREME BABY LOTION 500ML', 0, 0, 0, 0, '2', 'Unza Doremi', '2025-08-14 14:09:56', '2025-08-14 14:09:56'),
('4ba39706-7918-11f0-8ff9-bc2412b8fc93', 'DOREME BABY POWDER 500ML', 0, 0, 0, 0, '2', 'Unza Doremi', '2025-08-14 14:09:56', '2025-08-14 14:09:56'),
('4ba397b2-7918-11f0-8ff9-bc2412b8fc93', 'DOREME BABY OIL 500ML', 0, 0, 0, 0, '2', 'Unza Doremi', '2025-08-14 14:09:56', '2025-08-14 14:09:56'),
('4ccca95d-6326-11f0-b2e0-bc2412b8fc93', 'Honey beans', 10000, 12000, 600, 700, '4', 'Foodfstuff', '2025-07-17 15:54:19', '2025-08-19 14:51:23'),
('54481d05-7918-11f0-8ff9-bc2412b8fc93', 'ENCH.TALCUM POWDER (CHARMING) 50g', 0, 0, 0, 0, '2', 'Unza Powder', '2025-08-14 14:10:10', '2025-08-14 14:10:10'),
('54482231-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. TALCUM POWDER (ROMANTIC) 50g', 0, 0, 0, 0, '2', 'Unza Powder', '2025-08-14 14:10:10', '2025-08-14 14:10:10'),
('544822b1-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. TALCUM POWDER (STUNNING) 50g', 0, 0, 0, 0, '2', 'Unza Powder', '2025-08-14 14:10:10', '2025-08-14 14:10:10'),
('5448231c-7918-11f0-8ff9-bc2412b8fc93', 'ENCH.TALCUM POWDER (ALLURING) 50g', 0, 0, 0, 0, '2', 'Unza Powder', '2025-08-14 14:10:10', '2025-08-14 14:10:10'),
('5448236e-7918-11f0-8ff9-bc2412b8fc93', 'ENCH.TALCUM POWDER (ENTICING) 50g', 0, 0, 0, 0, '2', 'Unza Powder', '2025-08-14 14:10:10', '2025-08-14 14:10:10'),
('544823c5-7918-11f0-8ff9-bc2412b8fc93', 'ENCH.TALCUM POWDER (CHARMING) 125g', 0, 0, 0, 0, '2', 'Unza Powder', '2025-08-14 14:10:10', '2025-08-14 14:10:10'),
('5448240f-7918-11f0-8ff9-bc2412b8fc93', 'ENCH.TALCUM POWDER (ROMANTIC) 125g', 0, 0, 0, 0, '2', 'Unza Powder', '2025-08-14 14:10:10', '2025-08-14 14:10:10'),
('54482455-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. TALCUM POWDER (ALLURING) 125g', 0, 0, 0, 0, '2', 'Unza Powder', '2025-08-14 14:10:10', '2025-08-14 14:10:10'),
('54482499-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. TALCUM POWDER (STUNNING) 125g', 0, 0, 0, 0, '2', 'Unza Powder', '2025-08-14 14:10:10', '2025-08-14 14:10:10'),
('544824eb-7918-11f0-8ff9-bc2412b8fc93', 'ENCHANTEUR TALCUM POWDER ENTICING 125g', 0, 0, 0, 0, '2', 'Unza Powder', '2025-08-14 14:10:10', '2025-08-14 14:10:10'),
('5973fd1e-7917-11f0-8ff9-bc2412b8fc93', 'Pea Ssm 1,5% Box 12x1L v1', 0, 0, 0, 0, '1', 'Peak Yoghurt Drink', '2025-08-14 14:03:10', '2025-08-14 14:03:10'),
('5974078a-7917-11f0-8ff9-bc2412b8fc93', 'Pea Fcm 3,5% Box 12x1L v1', 0, 0, 0, 0, '1', 'Peak Yoghurt Drink', '2025-08-14 14:03:10', '2025-08-14 14:03:10'),
('597408d5-7917-11f0-8ff9-bc2412b8fc93', 'Pea Dky Strawberry Box 12x1L Pac', 0, 0, 0, 0, '1', 'Peak Yoghurt Drink', '2025-08-14 14:03:10', '2025-08-14 14:03:10'),
('5974094f-7917-11f0-8ff9-bc2412b8fc93', 'Pea Dky Plain Sweet Box 12x1L Pac', 0, 0, 0, 0, '1', 'Peak Yoghurt Drink', '2025-08-14 14:03:10', '2025-08-14 14:03:10'),
('597409ba-7917-11f0-8ff9-bc2412b8fc93', 'Peak Yoghurt Dr Plain Sweetened 24x90ml', 5400, 5700, 5400, 5800, '1', 'Peak Yoghurt Drink', '2025-08-14 14:03:10', '2025-11-19 14:03:41'),
('59740a2b-7917-11f0-8ff9-bc2412b8fc93', 'Peak Yoghurt Dr Strawberry 24x90ml', 0, 0, 0, 0, '1', 'Peak Yoghurt Drink', '2025-08-14 14:03:10', '2025-08-14 14:03:10'),
('59740a8c-7917-11f0-8ff9-bc2412b8fc93', 'Pea Dky Plain Sweet Box 12x318ml Pac', 0, 0, 0, 0, '1', 'Peak Yoghurt Drink', '2025-08-14 14:03:10', '2025-08-14 14:03:10'),
('59740aec-7917-11f0-8ff9-bc2412b8fc93', 'Pea Dky Strawberry Box 12x318ml Pac', 7120, 7300, 7300, 7300, '1', 'Peak Yoghurt Drink', '2025-08-14 14:03:10', '2025-08-22 13:00:11'),
('59740b33-7917-11f0-8ff9-bc2412b8fc93', 'Nunu Amb DKY Plain sweet 48x100ml', 0, 0, 0, 0, '1', 'Peak Yoghurt Drink', '2025-08-14 14:03:10', '2025-08-14 14:03:10'),
('59740b84-7917-11f0-8ff9-bc2412b8fc93', 'Nunu Amb DKY Plain sweet 48x150ml', 0, 0, 0, 0, '1', 'Peak Yoghurt Drink', '2025-08-14 14:03:10', '2025-08-14 14:03:10'),
('5da6de75-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. ROLL ON DEO-CHARMING 50ML', 0, 0, 0, 0, '2', 'Unza Rollon', '2025-08-14 14:10:26', '2025-08-14 14:10:26'),
('5da6e623-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. ROLL ON DEO-ROMANTIC 50ML', 0, 0, 0, 0, '2', 'Unza Rollon', '2025-08-14 14:10:26', '2025-08-14 14:10:26'),
('5da6e806-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. ROLL ON (ALLURING) 50ML', 0, 0, 0, 0, '2', 'Unza Rollon', '2025-08-14 14:10:26', '2025-08-14 14:10:26'),
('5da6e888-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. ROLL ON GORGEOUS 50ML', 0, 0, 0, 0, '2', 'Unza Rollon', '2025-08-14 14:10:26', '2025-08-14 14:10:26'),
('5da6e902-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. ROLL ON STUNNING 50ML', 0, 0, 0, 0, '2', 'Unza Rollon', '2025-08-14 14:10:26', '2025-08-14 14:10:26'),
('5da6e976-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. ROLL-ON ENTICING 50ML', 0, 0, 0, 0, '2', 'Unza Rollon', '2025-08-14 14:10:26', '2025-08-14 14:10:26'),
('5da6e9e7-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. ROLL ON WHITENING (ROMANTIC) 50ML', 0, 0, 0, 0, '2', 'Unza Rollon', '2025-08-14 14:10:26', '2025-08-14 14:10:26'),
('5da6ea46-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. ROLL ON WHITENING SOFT SMOOTH (ROMANTIC) 50ML', 0, 0, 0, 0, '2', 'Unza Rollon', '2025-08-14 14:10:26', '2025-08-14 14:10:26'),
('5da6ea94-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. ROLL ON WHITENING AGE RENEW (CHARMING) 50ML', 0, 0, 0, 0, '2', 'Unza Rollon', '2025-08-14 14:10:26', '2025-08-14 14:10:26'),
('5da6eae8-7918-11f0-8ff9-bc2412b8fc93', 'ECH WHITENING PURE REFINE CHARMING ROLLON 50ml', 0, 0, 0, 0, '2', 'Unza Rollon', '2025-08-14 14:10:26', '2025-08-14 14:10:26'),
('6487201e-7918-11f0-8ff9-bc2412b8fc93', 'ENCH.BODY SPRAY (CHARMING) 200ml', 0, 0, 0, 0, '2', 'Unza Spray', '2025-08-14 14:10:38', '2025-08-14 14:10:38'),
('648724f6-7918-11f0-8ff9-bc2412b8fc93', 'ENCH.BODY SPRAY (ROMANTIC) 200ml', 0, 0, 0, 0, '2', 'Unza Spray', '2025-08-14 14:10:38', '2025-08-14 14:10:38'),
('648725da-7918-11f0-8ff9-bc2412b8fc93', 'ENCH.BODY SPRAY (GORGEOUS) 200ml', 0, 0, 0, 0, '2', 'Unza Spray', '2025-08-14 14:10:38', '2025-08-14 14:10:38'),
('64872678-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. BODY SPRAY STUNNING 4*12*125G', 0, 0, 0, 0, '2', 'Unza Spray', '2025-08-14 14:10:38', '2025-08-14 14:10:38'),
('648726fd-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. BODY SPRAY ALLURING 200ml', 0, 0, 0, 0, '2', 'Unza Spray', '2025-08-14 14:10:38', '2025-08-14 14:10:38'),
('6701f175-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA 3 IN 1 MICELLAR WATER 400ML', 0, 0, 0, 0, '2', 'Nivea Face Care', '2025-08-14 14:03:32', '2025-08-14 14:03:32'),
('670202b0-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA 3 IN 1 FACE CLEANSER 150ML', 0, 0, 0, 0, '2', 'Nivea Face Care', '2025-08-14 14:03:32', '2025-08-14 14:03:32'),
('67020537-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA EVENTONE DAY CREAM 50ML', 0, 0, 0, 0, '2', 'Nivea Face Care', '2025-08-14 14:03:32', '2025-08-14 14:03:32'),
('6702071d-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA LIGHT MOISTURISER 50ML', 0, 0, 0, 0, '2', 'Nivea Face Care', '2025-08-14 14:03:32', '2025-08-14 14:03:32'),
('67020782-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA CLEANSING FOAM 100ML', 0, 0, 0, 0, '2', 'Nivea Face Care', '2025-08-14 14:03:32', '2025-08-14 14:03:32'),
('670207d5-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA PERFECT & RADIANT LUMINOUS DAYCREAM', 0, 0, 0, 0, '2', 'Nivea Face Care', '2025-08-14 14:03:32', '2025-08-14 14:03:32'),
('67020832-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA PERFECT & RADIANT LUMINOUS ADVANCED TREATMENT', 0, 0, 0, 0, '2', 'Nivea Face Care', '2025-08-14 14:03:32', '2025-08-14 14:03:32'),
('670208a5-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA LUMINOUS 630 ROUTINE PACK', 0, 0, 0, 0, '2', 'Nivea Face Care', '2025-08-14 14:03:32', '2025-08-14 14:03:32'),
('6b1e1a7f-7918-11f0-8ff9-bc2412b8fc93', 'ENCH.SOAP ALLURING 4*12 125G', 0, 0, 0, 0, '2', 'Unza Soap', '2025-08-14 14:10:49', '2025-08-14 14:10:49'),
('6b1e20bc-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. SOAP ROMANTIC 4*12*125G', 0, 0, 0, 0, '2', 'Unza Soap', '2025-08-14 14:10:49', '2025-08-14 14:10:49'),
('6b1e226e-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. SOAP CHARMING 4*12*125G', 0, 0, 0, 0, '2', 'Unza Soap', '2025-08-14 14:10:49', '2025-08-14 14:10:49'),
('6b1e2303-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. SOAP GORGEOUS 4*12*125G', 0, 0, 0, 0, '2', 'Unza Soap', '2025-08-14 14:10:49', '2025-08-14 14:10:49'),
('6b1e2395-7918-11f0-8ff9-bc2412b8fc93', 'ENCH. SOAP STUNNING 4*12*125G', 0, 0, 0, 0, '2', 'Unza Soap', '2025-08-14 14:10:49', '2025-08-14 14:10:49'),
('74b47163-7918-11f0-8ff9-bc2412b8fc93', 'TIGER RAZOR BLADE-SMALL (250)', 0, 0, 0, 0, '2', 'Razor Blade', '2025-08-14 14:11:05', '2025-08-14 14:11:05'),
('74b47644-7918-11f0-8ff9-bc2412b8fc93', 'SUPERMAX STAINLESS STEEL', 0, 0, 0, 0, '2', 'Razor Blade', '2025-08-14 14:11:05', '2025-08-14 14:11:05'),
('74b476e5-7918-11f0-8ff9-bc2412b8fc93', 'TIGER PLATINIUM (10X10X20X5)', 0, 0, 0, 0, '2', 'Razor Blade', '2025-08-14 14:11:05', '2025-08-14 14:11:05'),
('74b47737-7918-11f0-8ff9-bc2412b8fc93', 'TIGER RAZOR BLADES 25X20 (BIG)', 0, 0, 0, 0, '2', 'Razor Blade', '2025-08-14 14:11:05', '2025-08-14 14:11:05'),
('75d9a77c-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA LIPS CARE STRAWBERRY 1x12', 0, 0, 0, 0, '2', 'Nivea Lip Care', '2025-08-14 14:03:57', '2025-08-14 14:03:57'),
('75d9adca-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA LIPS CARE WATERMELON 1x12', 0, 0, 0, 0, '2', 'Nivea Lip Care', '2025-08-14 14:03:57', '2025-08-14 14:03:57'),
('75d9ae68-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA LIP CARE ORIGINAL 1x12', 0, 0, 0, 0, '2', 'Nivea Lip Care', '2025-08-14 14:03:57', '2025-08-14 14:03:57'),
('75d9aee0-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA LIPS CARE BLACKBERRY 1x12', 0, 0, 0, 0, '2', 'Nivea Lip Care', '2025-08-14 14:03:57', '2025-08-14 14:03:57'),
('75d9b0a0-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA LIP CARE ACTIVE 1x12', 0, 0, 0, 0, '2', 'Nivea Lip Care', '2025-08-14 14:03:57', '2025-08-14 14:03:57'),
('807300e3-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA BODY CREAM SOFT PLASTIC JAR 200ML', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('807308b3-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA BODY CREAM NATURAL FAIRNESS 200ML', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('80730996-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA BODY CREAM TIN 150ML 5X12', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('80730a36-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA MEN BODY CREAM TIN 150ML 5X6', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('80730a83-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA BODY CREAM NATURAL FAIRNESS 250ML 6X2', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('80730bd6-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA BODY LOTION EXPRESS HYDRATION 250ML 6X2', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('80730c3f-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA BODY LOTION ESSENTIALS CARING MILK 250ML 6X2', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('80730cfc-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA BODY LOTION NATURAL FAIRNESS(BODY WHITENING)400ML 6X2', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('80730d59-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA BODY LOTION (NOURISHING) 400ML 6X2', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('80730db0-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA BODY LOTION SHEA SMOOTH 400ML 6X2', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('80730e10-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA BODY LOTION REVITILIZING MILK(MEN) 400ML 6X2', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('80730e96-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA BODY LOTION EXPRESS HYDRATION 400ML 6X2', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('80730eeb-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA BODY LOTION MAX. HYDRATION 400ML 6X2', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('80730f6d-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA BODY LOTION PERFECT AND RADIANT 400ML 6x2', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('80730fc1-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA BODY LOTION RADIANT AND BEAUTY 400ML 6x2', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('8073100e-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA BODY LOTION RADIANT AND BEAUTY ADVANCED CARE 400ML 6x2', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('8073105b-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA MEN BODY DEEP 400ML', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('807310c8-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA BODY LOTION NOURISHING COCOA 400ML 6X2', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('8073111e-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA NOURISHING COCOA LOTION 400ml (PROMO PACK) 6X2', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('80731177-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA BODY LOTION ALOE & HYDRATION 400ml 6X2', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('807311d0-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA CHERRY BLOSSOM & JOJOBA OIL BODY LOTION 400ml (6X2)', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('80731225-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA VANILLA & ALMOND OIL BODY LOTION 400ml 6X2', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('80731383-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROSE & ARGAN OIL BODY LOTION 400ML 6X2', 0, 0, 0, 0, '2', 'Nivea Body Lotion', '2025-08-14 14:04:15', '2025-08-14 14:04:15'),
('8d2f27dd-632a-11f0-b2e0-bc2412b8fc93', 'Tin Tomato', 1200, 1600, 600, 800, '8', 'Foodfstuff', '2025-07-17 16:24:45', '2025-07-17 16:24:45'),
('9930ee8f-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL ON SILVER PROTECT 50ML 1x30', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930f440-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL ON DRY IMPACT (MEN) 50ML 1x30', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930f535-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL ON DEEP 50ML 1x30', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930f59e-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL ON DRY COMFORT 50ML(WHITE) 1x30', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930f5f3-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL ON INVISIBLE BLACK AND WHITE (WOMEN) 50ML 1x30', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930f757-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL ON INVISIBLE BLACK AND WHITE (MEN) 50ML 1x30', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930f797-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL-ON DRY MALE (MEN) 50ML 1x30', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930f7ce-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL-ON FRESH ACTIVE 50ML 1x30', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930f7ff-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL-ON DEEP BEAT 50ML', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930f82f-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL-ON DEEP ESPRESSO 50ML', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930f85c-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL-ON DEEP AMAZONIA 50ML', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930f88c-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL-ON DRY FRESH FEMALE 1x30', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930f8ba-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL ON COOL KICK (MEN) 50ML 1x30', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930f8ea-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL ON PEARL & BEAUTY 50ML 1x30', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930f937-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL ON PEARL & BEAUTY BLACK 50ML 1x30', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930f975-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL ON ENERGY FRESH (BLUE) 50ML 1x30', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930f9bc-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL ON FRESH SENSATION (BLUE) 50ML 1x30', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930fa00-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL ON PERFECT AND RADIANT 50ML 1x30', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930fa45-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL ON DRY IMPACT (MEN) 25ML 1x30', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('9930fa8c-7917-11f0-8ff9-bc2412b8fc93', 'NIVEA ROLL ON DRY COMFORT 25ML(WHITE) 1x30', 0, 0, 0, 0, '2', 'Nivea Rollons', '2025-08-14 14:04:56', '2025-08-14 14:04:56'),
('cbfca1bd-7918-11f0-8ff9-bc2412b8fc93', 'Drummer Airwick Gel Mixed - 50gm x96\'s', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfca8c2-7918-11f0-8ff9-bc2412b8fc93', 'AIRWICK FLUBBER', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcacd0-7918-11f0-8ff9-bc2412b8fc93', 'AW Flubber - Lavender 70g x 24', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcad91-7918-11f0-8ff9-bc2412b8fc93', 'AW Flubber - Cherry Blossom 70g x 24', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcae27-7918-11f0-8ff9-bc2412b8fc93', 'AW Flubber - Citrus 70g x 24', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcaeb5-7918-11f0-8ff9-bc2412b8fc93', 'Airwick Stick Up Lavender 30g x 24', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcaf31-7918-11f0-8ff9-bc2412b8fc93', 'Airwick Stick Up Citrus 30g x 24', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcafad-7918-11f0-8ff9-bc2412b8fc93', 'Airwick Aerosol - Rose 300ml x 12', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcb030-7918-11f0-8ff9-bc2412b8fc93', 'Airwick Aerosol - Fresh water 300ml x 12', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcb0b0-7918-11f0-8ff9-bc2412b8fc93', 'Airwick Aerosol - Peach & Jasmine 300ml x 12', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcb12c-7918-11f0-8ff9-bc2412b8fc93', 'Airwick Aerosol - Lavender 300ml x 12', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcb259-7918-11f0-8ff9-bc2412b8fc93', 'Airwick Aerosol - Citrus 300ml x 12', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcb307-7918-11f0-8ff9-bc2412b8fc93', 'Airwick Freshmatic - Lavender & Camomile (Complete)', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcb3aa-7918-11f0-8ff9-bc2412b8fc93', 'Airwick Freshmatic - Sparkling Citrus (Complete)', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcb42b-7918-11f0-8ff9-bc2412b8fc93', 'Airwick Freshmatic - Lavender & Camomile (Refill)', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcb4a1-7918-11f0-8ff9-bc2412b8fc93', 'Airwick Freshmatic - Sparkling Citrus (Refill)', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcb520-7918-11f0-8ff9-bc2412b8fc93', 'Airwick Freshmatic - White Flower (Refill)', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcb5a1-7918-11f0-8ff9-bc2412b8fc93', 'Airwick Freshmatic - Aquamarine (Refill)', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcb6a9-7918-11f0-8ff9-bc2412b8fc93', 'Airwick Freshmatic - Twinpack', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcb731-7918-11f0-8ff9-bc2412b8fc93', 'Airwick Freshmatic Twin pack refill Citrus', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('cbfcb7af-7918-11f0-8ff9-bc2412b8fc93', 'Airwick Freshmatic Twin pack refill Lavender', 0, 0, 0, 0, '4', 'AIR CARE', '2025-08-14 14:13:31', '2025-08-14 14:13:31'),
('d2595a7f-7918-11f0-8ff9-bc2412b8fc93', 'Jik Sachet 60ml x 72', 0, 0, 0, 0, '4', 'FABRIC CARE', '2025-08-14 14:13:42', '2025-08-14 14:13:42'),
('d259602e-7918-11f0-8ff9-bc2412b8fc93', 'Jik NGEU 475ml x 24', 0, 0, 0, 0, '4', 'FABRIC CARE', '2025-08-14 14:13:42', '2025-08-14 14:13:42'),
('d259611f-7918-11f0-8ff9-bc2412b8fc93', 'Jik NGEU 950ml x 12', 0, 0, 0, 0, '4', 'FABRIC CARE', '2025-08-14 14:13:42', '2025-08-14 14:13:42'),
('d259618f-7918-11f0-8ff9-bc2412b8fc93', 'Jik NGEU 1.4Ltr. x 8', 0, 0, 0, 0, '4', 'FABRIC CARE', '2025-08-14 14:13:42', '2025-08-14 14:13:42'),
('d4e843a5-6328-11f0-b2e0-bc2412b8fc93', 'Peak Pow 14gx210 sachet', 33273, 34000, 32273, 34000, '1', 'Powder Milk', '2025-07-17 16:12:27', '2025-08-22 13:03:38'),
('db032d7d-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Penfold 25ml x 144', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db0333c2-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Power Plus 200ml x 24', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db033457-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Power Plus 450ml x 12', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db0334b5-7918-11f0-8ff9-bc2412b8fc93', 'Harpic PowerPlus Citrus 450ml x 12', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db03351b-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Mountine Pine 450ml x 12', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db033561-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Lavender 450ml x 12', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db034fe6-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Power Plus 725ml x 12', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db0351a5-7918-11f0-8ff9-bc2412b8fc93', 'Harpic PowerPlus Citrus 725ml x 12', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db035224-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Mountain Pine 725ml x 12', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db0352a6-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Lavender 725ml x 12', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db035307-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Power Plus 1 L x 12', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db035358-7918-11f0-8ff9-bc2412b8fc93', 'HARPC,NG,PP CITRUS 1L', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db035467-7918-11f0-8ff9-bc2412b8fc93', 'HARPIC PENFOLD+12 SACHETS', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db0354b8-7918-11f0-8ff9-bc2412b8fc93', 'Harpic 450ml PP 15% off', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db0354fc-7918-11f0-8ff9-bc2412b8fc93', 'Harpic 450ml PPC 15% off', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db03553d-7918-11f0-8ff9-bc2412b8fc93', 'Harpic 450ml MP 15% off', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db0355bd-7918-11f0-8ff9-bc2412b8fc93', 'Harpic 450ml LAV 15% off', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db035607-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Powerplus 725ml x 12 15% off', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db0356eb-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Powerplus Citrus 725ml x12 15% off', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db03604e-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Mountain Pine 725ml x 12 15% off', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db0360d6-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Lavender 725ml x12 15% off', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db03616c-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Powerplus 725ml x 12 15% Bundle', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db0361e0-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Powerplus Citrus 725ml x 12 15% Bundle', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db03ebb6-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Mountain Pine 725ml x 12 15% Bundle', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db03ee4a-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Lavender 725ml x 12 15% Bundle', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db03f228-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Powerplus - 1L x 12 20% off', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('db03f2df-7918-11f0-8ff9-bc2412b8fc93', 'Harpic Powerplus Citrus - 1L x 12 20% off', 0, 0, 0, 0, '4', 'LAVATORY CARE', '2025-08-14 14:13:56', '2025-08-14 14:13:56'),
('e105291d-7918-11f0-8ff9-bc2412b8fc93', 'Mortein AIK 300ml x 12', 0, 0, 0, 0, '4', 'PEST CONTROL', '2025-08-14 14:14:06', '2025-08-14 14:14:06'),
('e1053078-7918-11f0-8ff9-bc2412b8fc93', 'Mortein OIK 300ml x 12', 0, 0, 0, 0, '4', 'PEST CONTROL', '2025-08-14 14:14:06', '2025-08-14 14:14:06'),
('e105318a-7918-11f0-8ff9-bc2412b8fc93', 'Mortein AIK 350ml x 12 Extra Free Promo', 0, 0, 0, 0, '4', 'PEST CONTROL', '2025-08-14 14:14:06', '2025-08-14 14:14:06'),
('e105322c-7918-11f0-8ff9-bc2412b8fc93', 'Mortein OIK 350ml x 12 Extra Free Promo', 0, 0, 0, 0, '4', 'PEST CONTROL', '2025-08-14 14:14:06', '2025-08-14 14:14:06'),
('e10532c2-7918-11f0-8ff9-bc2412b8fc93', 'Mortein Ins.Power C&A Killer x 12', 0, 0, 0, 0, '4', 'PEST CONTROL', '2025-08-14 14:14:06', '2025-08-14 14:14:06'),
('e1053346-7918-11f0-8ff9-bc2412b8fc93', 'Mortein A/Purpose Killer 550ml x 12', 0, 0, 0, 0, '4', 'PEST CONTROL', '2025-08-14 14:14:06', '2025-08-14 14:14:06'),
('e10533c4-7918-11f0-8ff9-bc2412b8fc93', 'MORTN,NG,OIK 550ml x 12', 0, 0, 0, 0, '4', 'PEST CONTROL', '2025-08-14 14:14:06', '2025-08-14 14:14:06'),
('eaff22cd-7918-11f0-8ff9-bc2412b8fc93', 'Mortein LED 30night Promo Complete x12s', 0, 0, 0, 0, '4', 'MORTEIN LED', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff2fbd-7918-11f0-8ff9-bc2412b8fc93', 'Mortein LED 30night Refill x24s', 0, 0, 0, 0, '4', 'MORTEIN LED', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff317b-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,ASL PS 75ML', 0, 0, 0, 0, '4', 'DETTOL LIQUID', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3207-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,ASL PS 165ML', 0, 0, 0, 0, '4', 'DETTOL LIQUID', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3276-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG, ASL 165ml 6+1 Promo', 0, 0, 0, 0, '4', 'DETTOL LIQUID', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff32f8-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,ASL PS 250ML', 0, 0, 0, 0, '4', 'DETTOL LIQUID', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3361-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,ASL PS 500ML', 0, 0, 0, 0, '4', 'DETTOL LIQUID', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff33cc-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,ASL PS 750ML', 0, 0, 0, 0, '4', 'DETTOL LIQUID', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff343a-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,ASL PS 1L', 0, 0, 0, 0, '4', 'DETTOL LIQUID', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff34a3-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,ASL PS 2L', 0, 0, 0, 0, '4', 'DETTOL LIQUID', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3518-7918-11f0-8ff9-bc2412b8fc93', 'Dettol Soap 55g Original x 144', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3586-7918-11f0-8ff9-bc2412b8fc93', 'Dettol Soap 55g Skincare x 144', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff35f5-7918-11f0-8ff9-bc2412b8fc93', 'Dettol Soap 50g Cool x 144', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff365b-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,ORIGINAL 70G', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff36cb-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,SKINCARE 75G', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff373b-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,COOL 70G', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff38f9-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,EVENTONE 70G', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3991-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,ET PGLOW 70G', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3a09-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,ORIGINAL 105G (NEW)', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3a87-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,SKINCARE 110G', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3b33-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,COOL NF 105G X 72', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3bbb-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,EVENTONE 105G', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3c2a-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,ET PGLOW 105G', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3c9c-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,ORIGINAL 155G', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3d14-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,SKINCARE 160G (NEW)', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3d91-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,COOL 155G', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3e04-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,EVENTONE 155G', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3e54-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,ET PGLOW 155G', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3e9b-7918-11f0-8ff9-bc2412b8fc93', 'DETTOL SOAP  PROMO', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3ee3-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,ORIGINAL 70G 6+1', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3f2f-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,SKINCARE 75G 6+1', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3f77-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,COOL 70G 6+1', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff3fc3-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,ORIGINAL 105G 6+1', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff4012-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,SKINCARE 110G 6+1', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23');
INSERT INTO `products` (`product_id`, `product_name`, `wholesale_cost_price`, `wholesale_selling_price`, `retail_cost_price`, `retail_selling_price`, `supplier_id`, `category`, `date_added`, `date_modified`) VALUES
('eaff405e-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,COOL 6+1 105G', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff4101-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,ORIGINAL 155G 10% OFF', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eaff41b8-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,SKINCARE 160G 10% OFF', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eb00232c-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,COOL 155G 10% OF', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eb002518-7918-11f0-8ff9-bc2412b8fc93', 'DETOL,NG,EVENTONE 155G 10% OFF', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eb0025d1-7918-11f0-8ff9-bc2412b8fc93', 'DETOL PGLOW 155G 10% OFF', 0, 0, 0, 0, '4', 'ANTICEPTIC SOAP', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eb00264c-7918-11f0-8ff9-bc2412b8fc93', 'Veet Normal 100ml x 6', 0, 0, 0, 0, '4', 'VEET', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eb002744-7918-11f0-8ff9-bc2412b8fc93', 'Veet Sensitive 100ml x 6', 0, 0, 0, 0, '4', 'VEET', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eb00279b-7918-11f0-8ff9-bc2412b8fc93', 'Drx Extra Safe 3x12 (Multiple of 24s)', 0, 0, 0, 0, '4', 'DUREX', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eb002810-7918-11f0-8ff9-bc2412b8fc93', 'Drx Fetherlite 3x12 (Multiple of 24s)', 0, 0, 0, 0, '4', 'DUREX', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eb002860-7918-11f0-8ff9-bc2412b8fc93', 'Drx Elite 3x12 (Multiple of 24s)', 0, 0, 0, 0, '4', 'DUREX', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eb0028ab-7918-11f0-8ff9-bc2412b8fc93', 'Drx Select 3x12 (Multiple of 24s)', 0, 0, 0, 0, '4', 'DUREX', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eb00293f-7918-11f0-8ff9-bc2412b8fc93', 'Drx Performa 3x12(Multiple of 24)', 0, 0, 0, 0, '4', 'DUREX', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eb0029bc-7918-11f0-8ff9-bc2412b8fc93', 'Durex Pleasure Me 3x12 (Multiple of 24s)', 0, 0, 0, 0, '4', 'DUREX', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eb002a3a-7918-11f0-8ff9-bc2412b8fc93', 'Durex Extra Safe 12\'s (Multiple of 12s)', 0, 0, 0, 0, '4', 'DUREX', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eb002a8f-7918-11f0-8ff9-bc2412b8fc93', 'Durex Fetherlite 12\'s (Multiple of 12s)', 0, 0, 0, 0, '4', 'DUREX', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eb002ae6-7918-11f0-8ff9-bc2412b8fc93', 'Drx Feels (Multiple of 24)', 0, 0, 0, 0, '4', 'DUREX', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eb002b5e-7918-11f0-8ff9-bc2412b8fc93', 'Durex Play Tingle 50ml (Multiple of 24)', 0, 0, 0, 0, '4', 'DUREX', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eb002bef-7918-11f0-8ff9-bc2412b8fc93', 'Durex Mutual Climax 3x12 (Multiple of 24)', 0, 0, 0, 0, '4', 'DUREX', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eb002c62-7918-11f0-8ff9-bc2412b8fc93', 'Durex Play Feel 50ml (Multiple of 24)', 0, 0, 0, 0, '4', 'DUREX', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('eb002ccf-7918-11f0-8ff9-bc2412b8fc93', 'Durex Play Strawberry 50ml (Multiple of 24)', 0, 0, 0, 0, '4', 'DUREX', '2025-08-14 14:14:23', '2025-08-14 14:14:23'),
('f3087dab-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY NOODLES CHICKEN 70g X 40', 0, 0, 0, 0, '5', 'GOLDEN PENNY NOODLES', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f3088586-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY NOODLES JOLLOF 70g X 40', 0, 0, 0, 0, '5', 'GOLDEN PENNY NOODLES', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f3088656-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY NOODLES GOAT 70g X 40', 0, 0, 0, 0, '5', 'GOLDEN PENNY NOODLES', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f30886de-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY NOODLES GOAT 120g X 40', 0, 0, 0, 0, '5', 'GOLDEN PENNY NOODLES', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f308875c-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY NOODLES JOLLOF 120g X 40', 0, 0, 0, 0, '5', 'GOLDEN PENNY NOODLES', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f30887e0-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY SPAGETTI 500gm X 20', 0, 0, 0, 0, '5', 'GOLDEN PENNY SPAGETTI', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f3088871-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY SPAGETTINI 500gm X 20', 0, 0, 0, 0, '5', 'GOLDEN PENNY SPAGETTI', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f30888e9-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY MAC ELBOW 500g X 20', 0, 0, 0, 0, '5', 'GOLDEN PENNY MAC ELBOW', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f3088961-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY MAC TWIST 500g X 20', 0, 0, 0, 0, '5', 'GOLDEN PENNY MAC TWIST', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f30889e1-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY GOLDENVITA 10kg', 0, 0, 0, 0, '5', 'GOLDEN PENNY GOLDENVITA', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f3088a53-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY GOLDENVITA 5kg', 0, 0, 0, 0, '5', 'GOLDEN PENNY GOLDENVITA', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f3088ad2-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY GOLDENVITA 2kg', 0, 0, 0, 0, '5', 'GOLDEN PENNY GOLDENVITA', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f3088b44-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY GOLDENVITA 1kg', 0, 0, 0, 0, '5', 'GOLDEN PENNY GOLDENVITA', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f3088cf8-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY SEMOVITA 10kg X 4', 0, 0, 0, 0, '5', 'GOLDEN PENNY SEMOVITA', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f3088d60-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY SEMOVITA 5kg X2', 0, 0, 0, 0, '5', 'GOLDEN PENNY SEMOVITA', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f3088dcb-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY SEMOVITA 2kg X 5', 0, 0, 0, 0, '5', 'GOLDEN PENNY SEMOVITA', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f3088e34-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY SEMOVITA 1kg X 10', 0, 0, 0, 0, '5', 'GOLDEN PENNY SEMOVITA', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f3088eaa-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY SUGAR  50kg', 0, 0, 0, 0, '5', 'GOLDEN PENNY SUGAR', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f3088f4f-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY CUBE SUGAR 50 X 500gm', 0, 0, 0, 0, '5', 'GOLDEN PENNY SUGAR', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f3088fb5-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY SUGAR GRANULATED 500gm X 20', 0, 0, 0, 0, '5', 'GOLDEN PENNY SUGAR', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('f3089025-7918-11f0-8ff9-bc2412b8fc93', 'GOLDEN PENNY SUGAR GRANULATED 250gm X 40', 0, 0, 0, 0, '5', 'GOLDEN PENNY SUGAR', '2025-08-14 14:14:37', '2025-08-14 14:14:37'),
('fb5b2af5-7918-11f0-8ff9-bc2412b8fc93', '50CL AQUABILL TABLE WATER', 0, 0, 0, 0, '6', 'AQUABILL TABLE WATER', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5b31b4-7918-11f0-8ff9-bc2412b8fc93', '75CL AQUABILL TABLE WATER', 0, 0, 0, 0, '6', 'AQUABILL TABLE WATER', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5b32b3-7918-11f0-8ff9-bc2412b8fc93', '50CL SACHET TABLE WATER', 0, 0, 0, 0, '6', 'AQUABILL TABLE WATER', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5b3340-7918-11f0-8ff9-bc2412b8fc93', 'DISPENSER WATER', 0, 0, 0, 0, '6', 'AQUABILL TABLE WATER', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5b33ea-7918-11f0-8ff9-bc2412b8fc93', '14.8g Pentagon preform (28mm) bag', 0, 0, 0, 0, '6', 'RAW MATERIAL', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5b3468-7918-11f0-8ff9-bc2412b8fc93', '18g Pentagon preform (30mm) bag', 0, 0, 0, 0, '6', 'RAW MATERIAL', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5b34eb-7918-11f0-8ff9-bc2412b8fc93', '20.5g Pentagon preform bag', 0, 0, 0, 0, '6', 'RAW MATERIAL', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5b3563-7918-11f0-8ff9-bc2412b8fc93', '30mm Bottle caps Lovpeet', 0, 0, 0, 0, '6', 'RAW MATERIAL', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5b35db-7918-11f0-8ff9-bc2412b8fc93', '30mm Bottle caps Pentagon', 0, 0, 0, 0, '6', 'RAW MATERIAL', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5b3659-7918-11f0-8ff9-bc2412b8fc93', '18g Lovpet preform (30mm) bag', 0, 0, 0, 0, '6', 'RAW MATERIAL', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5b36d9-7918-11f0-8ff9-bc2412b8fc93', '15g Lovpet (28mm) bag', 0, 0, 0, 0, '6', 'RAW MATERIAL', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5c4509-7918-11f0-8ff9-bc2412b8fc93', 'Shrink wrap', 0, 0, 0, 0, '6', 'Nylon', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5c4772-7918-11f0-8ff9-bc2412b8fc93', '75cl Label', 0, 0, 0, 0, '6', 'Nylon', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5c481e-7918-11f0-8ff9-bc2412b8fc93', '50cl Label', 0, 0, 0, 0, '6', 'Nylon', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5c48b5-7918-11f0-8ff9-bc2412b8fc93', 'Sachet roll', 0, 0, 0, 0, '6', 'Nylon', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5c4946-7918-11f0-8ff9-bc2412b8fc93', 'Parking Bag', 0, 0, 0, 0, '6', 'Nylon', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5c49d5-7918-11f0-8ff9-bc2412b8fc93', 'Dispenser Bag', 0, 0, 0, 0, '6', 'Nylon', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5c4a6b-7918-11f0-8ff9-bc2412b8fc93', 'Dispenser Bottle', 0, 0, 0, 0, '6', 'Nylon', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5c4aef-7918-11f0-8ff9-bc2412b8fc93', 'Dispenser Label', 0, 0, 0, 0, '6', 'Nylon', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5c4b6c-7918-11f0-8ff9-bc2412b8fc93', 'Dispenser Caps', 0, 0, 0, 0, '6', 'Nylon', '2025-08-14 14:14:51', '2025-08-14 14:14:51'),
('fb5c4bfa-7918-11f0-8ff9-bc2412b8fc93', 'Tamper proof', 0, 0, 0, 0, '6', 'Nylon', '2025-08-14 14:14:51', '2025-08-14 14:14:51');

-- --------------------------------------------------------

--
-- Table structure for table `sale_items`
--

CREATE TABLE `sale_items` (
  `sale_item_id` char(36) NOT NULL,
  `sale_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` int(11) NOT NULL,
  `discount` int(11) NOT NULL DEFAULT 0,
  `sale_type` enum('wholesale','retail') NOT NULL,
  `sub_total` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `sale_items`
--
DELIMITER $$
CREATE TRIGGER `trg_update_branch_stock_on_sale` BEFORE INSERT ON `sale_items` FOR EACH ROW BEGIN
  -- Declare a variable to store the branch_id
  DECLARE v_branch_id CHAR(36);
  -- Get the branch_id from branch_sales using the sale_id
  SELECT branch_id INTO v_branch_id
  FROM branch_sales
  WHERE sale_id = NEW.sale_id;
  -- Update the appropriate stock quantity based on the sale_type
  IF NEW.sale_type = 'wholesale' THEN
    UPDATE branch_stock
    SET stock_quantity_wholesale = stock_quantity_wholesale - NEW.quantity,
        date_modified = CURRENT_TIMESTAMP()
    WHERE product_id = NEW.product_id AND branch_id = v_branch_id;
  ELSEIF NEW.sale_type = 'retail' THEN
    UPDATE branch_stock
    SET stock_quantity_retail = stock_quantity_retail - NEW.quantity,
        date_modified = CURRENT_TIMESTAMP()
    WHERE product_id = NEW.product_id AND branch_id = v_branch_id;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `stock_transfer_history`
--

CREATE TABLE `stock_transfer_history` (
  `history_id` char(36) NOT NULL DEFAULT uuid(),
  `branch_name` varchar(100) NOT NULL,
  `branch_id` char(36) DEFAULT NULL,
  `target_branch_name` varchar(100) NOT NULL,
  `target_branch_id` char(36) NOT NULL,
  `product_id` char(36) DEFAULT NULL,
  `type` enum('wholesale','retail') DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `transfer_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `store_branches`
--

CREATE TABLE `store_branches` (
  `branch_id` char(36) NOT NULL DEFAULT 'uuid()',
  `branch_name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_inspected` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `store_branches`
--

INSERT INTO `store_branches` (`branch_id`, `branch_name`, `address`, `date_created`, `last_inspected`) VALUES
('5f51732a-3b5d-11f0-88dd-bc2411d9ced4', 'HEAD OFFICE', '', '2025-05-28 00:49:05', '2025-12-08 16:58:17'),
('5f518471-3b5d-11f0-88dd-bc2411d9ced4', 'WATT', '', '2025-05-28 00:49:05', '2025-12-05 17:18:38'),
('69ecb3ff-3b5d-11f0-88dd-bc2411d9ced4', 'MARIAN', '', '2025-05-28 00:49:22', '2025-12-06 15:48:20'),
('77123e3f-42b7-11f0-a09a-bc2411d9ced4', 'CALABAR SOUTH', '', '2025-06-06 09:20:38', '2025-10-23 12:56:50'),
('77124b22-42b7-11f0-a09a-bc2411d9ced4', 'TINAPA', '', '2025-06-06 09:20:38', '2025-09-30 13:43:14');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `supplier_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(200) DEFAULT NULL,
  `contact` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`supplier_id`, `name`, `address`, `contact`, `email`) VALUES
('1', 'WAMCO', NULL, NULL, NULL),
('2', 'AAVA NIVEA', NULL, NULL, NULL),
('3', 'AAVA NON-NIVEA', NULL, NULL, NULL),
('4', 'RECKITT', NULL, NULL, NULL),
('5', 'FMN', NULL, NULL, NULL),
('6', 'AQUABIL', NULL, NULL, NULL),
('7', 'GUINESS', NULL, NULL, NULL),
('8', 'TOMATOE JOS', NULL, NULL, NULL),
('9', 'PZ', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `transaction_types`
--

CREATE TABLE `transaction_types` (
  `type_code` varchar(20) NOT NULL,
  `type_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction_types`
--

INSERT INTO `transaction_types` (`type_code`, `type_name`, `description`, `is_active`, `created_at`) VALUES
('ADJUSTMENT', 'Adjustment Entry', 'Correcting or adjusting entry', 1, '2025-12-06 16:31:30'),
('ASSET_PURCHASE', 'Asset Purchase', 'Purchase of fixed assets', 1, '2025-12-06 16:31:30'),
('DEPRECIATION', 'Depreciation Entry', 'Recording asset depreciation', 1, '2025-12-06 16:31:30'),
('EXPENSE', 'General Expense', 'Recording of business expenses', 1, '2025-12-06 16:31:30'),
('JOURNAL', 'Journal Entry', 'General journal entry', 1, '2025-12-06 16:31:30'),
('OPENING_BALANCE', 'Opening Balance', 'Opening balance entry', 1, '2025-12-06 16:31:30'),
('PAYMENT_IN', 'Payment Received', 'Cash or payment received from customers', 1, '2025-12-06 16:31:30'),
('PAYMENT_OUT', 'Payment Made', 'Cash or payment made to suppliers', 1, '2025-12-06 16:31:30'),
('PAYROLL', 'Payroll Processing', 'Processing of payroll with deductions', 1, '2025-12-06 16:31:30'),
('PURCHASE', 'Purchase Transaction', 'Purchase of goods or services', 1, '2025-12-06 16:31:30'),
('SALARY', 'Salary Payment', 'Payment of employee salaries', 1, '2025-12-06 16:31:30'),
('SALE', 'Sales Transaction', 'Revenue from sales of goods or services', 1, '2025-12-06 16:31:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` char(36) NOT NULL,
  `email` varchar(200) NOT NULL,
  `username` varchar(200) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `username`, `password`, `role`) VALUES
('1', 'testemail@gmail.com', 'marybill-admin', '$2b$10$6H84XLARhXiapE/hPuWtoeCU5i3kLVgz4YKkYHVhKdPDuqkf0XhsC', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assets`
--
ALTER TABLE `assets`
  ADD KEY `idx_asset_category` (`asset_category`),
  ADD KEY `idx_asset_status` (`status`),
  ADD KEY `idx_asset_location` (`location`);

--
-- Indexes for table `branch_sales`
--
ALTER TABLE `branch_sales`
  ADD PRIMARY KEY (`sale_id`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Indexes for table `branch_stock`
--
ALTER TABLE `branch_stock`
  ADD PRIMARY KEY (`stock_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `chart_of_accounts`
--
ALTER TABLE `chart_of_accounts`
  ADD PRIMARY KEY (`account_code`),
  ADD KEY `parent_account` (`parent_account`),
  ADD KEY `idx_chart_of_accounts_type` (`account_type`);

--
-- Indexes for table `ledger_entries`
--
ALTER TABLE `ledger_entries`
  ADD PRIMARY KEY (`entry_id`),
  ADD KEY `idx_ledger_entries_transaction` (`transaction_id`),
  ADD KEY `idx_ledger_entries_account` (`account_code`),
  ADD KEY `idx_ledger_entries_date` (`entry_date`);

--
-- Indexes for table `ledger_transactions`
--
ALTER TABLE `ledger_transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `idx_ledger_transactions_date` (`transaction_date`),
  ADD KEY `idx_ledger_transactions_type` (`transaction_type`);

--
-- Indexes for table `payroll`
--
ALTER TABLE `payroll`
  ADD PRIMARY KEY (`payroll_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD UNIQUE KEY `unique_product` (`product_name`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- Indexes for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`sale_item_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `sale_id` (`sale_id`);

--
-- Indexes for table `stock_transfer_history`
--
ALTER TABLE `stock_transfer_history`
  ADD PRIMARY KEY (`history_id`),
  ADD UNIQUE KEY `history_id` (`history_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `target_branch_id` (`target_branch_id`);

--
-- Indexes for table `store_branches`
--
ALTER TABLE `store_branches`
  ADD PRIMARY KEY (`branch_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`supplier_id`);

--
-- Indexes for table `transaction_types`
--
ALTER TABLE `transaction_types`
  ADD PRIMARY KEY (`type_code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `branch_sales`
--
ALTER TABLE `branch_sales`
  ADD CONSTRAINT `branch_sales_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `store_branches` (`branch_id`);

--
-- Constraints for table `branch_stock`
--
ALTER TABLE `branch_stock`
  ADD CONSTRAINT `branch_stock_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `store_branches` (`branch_id`),
  ADD CONSTRAINT `branch_stock_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `chart_of_accounts`
--
ALTER TABLE `chart_of_accounts`
  ADD CONSTRAINT `chart_of_accounts_ibfk_1` FOREIGN KEY (`parent_account`) REFERENCES `chart_of_accounts` (`account_code`);

--
-- Constraints for table `ledger_entries`
--
ALTER TABLE `ledger_entries`
  ADD CONSTRAINT `ledger_entries_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `ledger_transactions` (`transaction_id`),
  ADD CONSTRAINT `ledger_entries_ibfk_2` FOREIGN KEY (`account_code`) REFERENCES `chart_of_accounts` (`account_code`);

--
-- Constraints for table `ledger_transactions`
--
ALTER TABLE `ledger_transactions`
  ADD CONSTRAINT `ledger_transactions_ibfk_1` FOREIGN KEY (`transaction_type`) REFERENCES `transaction_types` (`type_code`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`);

--
-- Constraints for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `branch_sales` (`sale_id`),
  ADD CONSTRAINT `sale_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `stock_transfer_history`
--
ALTER TABLE `stock_transfer_history`
  ADD CONSTRAINT `stock_transfer_history_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `store_branches` (`branch_id`),
  ADD CONSTRAINT `stock_transfer_history_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  ADD CONSTRAINT `stock_transfer_history_ibfk_3` FOREIGN KEY (`target_branch_id`) REFERENCES `store_branches` (`branch_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

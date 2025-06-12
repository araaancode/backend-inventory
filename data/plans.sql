CREATE TABLE `plans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `price` int(11) NOT NULL DEFAULT 0,
  `percent_off` smallint(6) NOT NULL DEFAULT 0,
  `invoice_period` smallint(5) UNSIGNED NOT NULL DEFAULT 0,
  `sort_order` mediumint(8) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `name`, `description`, `is_active`, `price`, `percent_off`, `invoice_period`, `sort_order`, `created_at`, `updated_at`, `deleted_at`) VALUES
(2, 'یک ماهه', NULL, 1, 25000, 30, 30, 1, '2021-06-10 14:29:44', '2021-09-24 05:20:46', NULL),
(3, 'سه ماهه', NULL, 1, 65000, 35, 90, 2, '2021-06-10 14:29:44', '2021-08-11 17:39:00', NULL),
(4, 'شش ماهه', NULL, 1, 130000, 40, 180, 3, '2021-06-10 14:29:44', '2021-08-11 17:41:20', NULL),
(5, 'یک ساله', NULL, 1, 260000, 45, 365, 4, '2021-06-28 03:41:03', '2021-08-11 17:41:30', NULL);

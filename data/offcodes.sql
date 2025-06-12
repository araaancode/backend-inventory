CREATE TABLE `offcodes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(191) NOT NULL,
  `count` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `can_reuse` tinyint(1) NOT NULL DEFAULT 1,
  `percent` smallint(6) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `offcodes`
--

INSERT INTO `offcodes` (`id`, `code`, `count`, `is_active`, `can_reuse`, `percent`, `created_at`, `updated_at`) VALUES
(7, 'hedyeh', 50, 1, 0, 100, '2021-10-18 19:55:36', '2021-10-31 18:38:59');

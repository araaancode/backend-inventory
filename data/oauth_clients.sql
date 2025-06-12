CREATE TABLE `oauth_clients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `secret` varchar(100) DEFAULT NULL,
  `provider` varchar(191) DEFAULT NULL,
  `redirect` text NOT NULL,
  `personal_access_client` tinyint(1) NOT NULL,
  `password_client` tinyint(1) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `oauth_clients`
--

INSERT INTO `oauth_clients` (`id`, `user_id`, `name`, `secret`, `provider`, `redirect`, `personal_access_client`, `password_client`, `revoked`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Laravel Personal Access Client', 'udp52M3jNcYfpKWsYI4JYj2rvpydPiWjRQhYHCH5', NULL, 'http://localhost', 1, 0, 0, '2021-04-01 13:06:48', '2021-04-01 13:06:48'),
(2, NULL, 'Laravel Password Grant Client', '4T9OgPAlnmqtpudr6DEd3NXP0usiX5nVntKafkcu', 'users', 'http://localhost', 0, 1, 0, '2021-04-01 13:06:48', '2021-04-01 13:06:48');

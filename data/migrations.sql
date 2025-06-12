CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(191) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2016_06_01_000001_create_oauth_auth_codes_table', 1),
(4, '2016_06_01_000002_create_oauth_access_tokens_table', 1),
(5, '2016_06_01_000003_create_oauth_refresh_tokens_table', 1),
(6, '2016_06_01_000004_create_oauth_clients_table', 1),
(7, '2016_06_01_000005_create_oauth_personal_access_clients_table', 1),
(8, '2019_08_19_000000_create_failed_jobs_table', 1),
(9, '2020_12_26_001727_create_jobs_table', 1),
(10, '2020_12_26_172016_create_clients_table', 1),
(11, '2020_12_26_180052_add_active_to_jobs_table', 1),
(12, '2020_12_26_223926_create_transactions_table', 1),
(13, '2020_12_27_193329_create_products_table', 1),
(14, '2020_12_27_232420_create_units_table', 1),
(15, '2021_03_06_183203_create_one_report_sms_table', 1),
(16, '2021_03_09_172817_create_default_invoices_table', 1),
(17, '2021_03_18_113203_create_posted_invoices_table', 1),
(18, '2021_03_21_140936_create_default_invoice_items_table', 1),
(19, '2021_03_22_160043_add_transaction_id_to_posted_invoices_table', 1),
(20, '2021_03_22_161719_add_posted_invoice_id_to_transactions_table', 1),
(21, '2021_03_25_173014_create_alarms_table', 1),
(22, '2021_03_26_125827_create_general_report_sms_table', 1),
(23, '2021_03_27_133817_add_uuid_to_posted_invoices_table', 1),
(25, '2021_04_04_173524_add_posted_to_alarms_table', 2),
(26, '2020_01_02_163632_create_verifications_table', 3),
(27, '2020_01_04_000331_create_plans_table', 3),
(28, '2020_01_04_000333_create_plan_subscriptions_table', 3),
(29, '2020_01_05_004037_create_offcodes_table', 3),
(30, '2020_01_14_235817_create_payments_table', 3),
(31, '2021_09_21_163254_create_app_versions_table', 4);

CREATE TABLE `app_versions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `version_number` int(11) NOT NULL,
  `forced_status` tinyint(1) NOT NULL,
  `download_link` varchar(191) DEFAULT NULL,
  `update_desc` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_versions`
--

INSERT INTO `app_versions` (`id`, `version_number`, `forced_status`, `download_link`, `update_desc`, `created_at`, `updated_at`) VALUES
(1, 10, 0, 'https://cafebazaar.ir/app/ir.asoservice.hesab', 'برطرف شدن مشکل ثبت کالا هنگامی که برای کالا واحد تعیین نمی شود,بهبود عملکرد انتخاب عکس از دوربین و گالری,بهبود عملکرد انتخاب مشتری از دفتر مخاطبین گوشی', '2021-09-21 12:24:29', '2021-09-21 12:24:55');

CREATE TABLE `users` (
  `userAddress` varchar(42) NOT NULL,
  `signature` varchar(132) DEFAULT NULL,
  `apiKey` varchar(13) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
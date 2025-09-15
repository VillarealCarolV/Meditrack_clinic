-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 15, 2025 at 04:59 PM
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
-- Database: `emr`
--

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `type` enum('SCHEDULE_REQUEST','SCHEDULE_APPROVED','SCHEDULE_REJECTED','APPOINTMENT_CONFIRMED','APPOINTMENT_CANCELLED') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `isRead` tinyint(1) DEFAULT 0,
  `metadata` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schedule_change_requests`
--

CREATE TABLE `schedule_change_requests` (
  `id` int(11) NOT NULL,
  `doctorId` int(11) NOT NULL,
  `requestType` enum('UNAVAILABLE','TIME_OFF','APPOINTMENT_CHANGE') NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  `requestedBy` enum('DOCTOR','STAFF') NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `reason` text DEFAULT NULL,
  `conflictResolution` enum('RESCHEDULE','CANCEL','KEEP_AS_IS') DEFAULT NULL,
  `reviewedBy` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schedule_slots`
--

CREATE TABLE `schedule_slots` (
  `id` int(11) NOT NULL,
  `doctorId` int(11) NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `status` enum('AVAILABLE','BOOKED','UNAVAILABLE') DEFAULT 'AVAILABLE',
  `appointmentId` int(11) DEFAULT NULL,
  `changeRequestId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20230827000000-create-schedule-tables.js'),
('20230827000001-add-foreign-keys-to-schedule-tables.js'),
('20230828000000-create-notifications.js'),
('20250602-add-status-to-users.js');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','owner','staff','doctor','nurse','patient') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `status` enum('pending','active','rejected') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `createdAt`, `updatedAt`, `status`) VALUES
(9, 'admin@meditrack.com', '$2a$10$OjKXHqvboZrmds1MyRIIjONoFLXG.Djy1h3Z2dJ9.QLLe.iuDEi7W', 'admin', '2025-06-12 12:17:26', '2025-06-12 12:17:26', 'active'),
(10, 'staff@meditrack.com', '$2a$10$KbF9fT11th3BhuaZWJeY0esf9.l.1TO6Cr8R1uYv/tZjvd6QCY0xO', 'staff', '2025-06-12 12:18:41', '2025-09-07 03:03:23', 'active'),
(11, 'doctor@meditrack.com', '$2a$10$TrDHn8nfjr4wYdYzEl5J/u0IVHLAgA3Cm3br8CJTbALTEXVM6o7Pq', 'doctor', '2025-09-08 16:33:16', '2025-09-08 16:33:16', 'active'),
(12, 'patient@meditrack.com', '$2a$10$6KRy7ibdvxh1R9V7nF5fWebXBCq3VOkJsOCJScp4FaWUsShCc91Zq', 'patient', '2025-09-08 16:38:43', '2025-09-08 16:38:43', 'active'),
(13, 'nurse@meditrack.com', '$2a$10$DDMBc1WO/1teIGnffuKfoOdO/z7gp/Pi2ruHMFtNVkZ0BqN82Kt.e', 'nurse', '2025-09-08 16:57:38', '2025-09-08 16:57:38', 'active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_is_read` (`userId`,`isRead`);

--
-- Indexes for table `schedule_change_requests`
--
ALTER TABLE `schedule_change_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `schedule_change_requests_doctor_id` (`doctorId`),
  ADD KEY `schedule_change_requests_status` (`status`),
  ADD KEY `schedule_change_requests_start_time_end_time` (`startTime`,`endTime`),
  ADD KEY `fk_schedule_change_requests_reviewer` (`reviewedBy`);

--
-- Indexes for table `schedule_slots`
--
ALTER TABLE `schedule_slots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `schedule_slots_doctor_id` (`doctorId`),
  ADD KEY `schedule_slots_status` (`status`),
  ADD KEY `schedule_slots_start_time_end_time` (`startTime`,`endTime`),
  ADD KEY `fk_schedule_slots_change_request` (`changeRequestId`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `email_32` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `schedule_change_requests`
--
ALTER TABLE `schedule_change_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `schedule_slots`
--
ALTER TABLE `schedule_slots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `schedule_change_requests`
--
ALTER TABLE `schedule_change_requests`
  ADD CONSTRAINT `fk_schedule_change_requests_doctor` FOREIGN KEY (`doctorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_schedule_change_requests_reviewer` FOREIGN KEY (`reviewedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `schedule_change_requests_ibfk_1` FOREIGN KEY (`doctorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `schedule_slots`
--
ALTER TABLE `schedule_slots`
  ADD CONSTRAINT `fk_schedule_slots_change_request` FOREIGN KEY (`changeRequestId`) REFERENCES `schedule_change_requests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_schedule_slots_doctor` FOREIGN KEY (`doctorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `schedule_slots_ibfk_1` FOREIGN KEY (`doctorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

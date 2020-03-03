-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 01, 2020 at 07:28 PM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `familyapp`
--
CREATE DATABASE IF NOT EXISTS `familyapp` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `familyapp`;

-- --------------------------------------------------------

--
-- Table structure for table `calendar`
--

CREATE TABLE `calendar` (
  `id` int(11) NOT NULL,
  `familyId` int(11) NOT NULL,
  `addedBy` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_bin NOT NULL,
  `description` varchar(255) COLLATE utf8_bin NOT NULL,
  `startdate` datetime NOT NULL,
  `kind` int(1) NOT NULL,
  `status` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `calendar`
--

INSERT INTO `calendar` (`id`, `familyId`, `addedBy`, `title`, `description`, `startdate`, `kind`, `status`) VALUES
(3, 9, 1, 'My Family!', 'sometimes is okay sometime is bad sometimes is okay sometime is bad sometimes is okay sometime is bad ', '2020-02-16 00:00:00', 2, 1),
(17, 9, 3, 'My Family!', 'tests are very important', '2020-02-10 00:00:00', 3, 1),
(28, 9, 3, 'My Family!', 'For the count', '2020-02-14 00:00:00', 4, 4),
(30, 9, 1, 'Хах', 'Създаване на работеща апликация, за втори кръг на олимпиадата по ИТ 2019-2020.', '2020-02-10 00:00:00', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `calendarstatus`
--

CREATE TABLE `calendarstatus` (
  `id` int(1) NOT NULL,
  `statusType` varchar(20) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `calendarstatus`
--

INSERT INTO `calendarstatus` (`id`, `statusType`) VALUES
(1, 'in progress'),
(2, 'off schedule'),
(3, 'completed'),
(4, 'planned');

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `id` int(11) NOT NULL,
  `familyId` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_bin NOT NULL,
  `description` varchar(255) COLLATE utf8_bin NOT NULL,
  `gtp` datetime NOT NULL,
  `service` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `families`
--

CREATE TABLE `families` (
  `id` int(11) NOT NULL,
  `familyName` varchar(100) COLLATE utf8_bin NOT NULL,
  `members` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `families`
--

INSERT INTO `families` (`id`, `familyName`, `members`) VALUES
(9, 'Herta', 2);

-- --------------------------------------------------------

--
-- Table structure for table `gallery_albums`
--

CREATE TABLE `gallery_albums` (
  `album_id` int(11) NOT NULL,
  `familyId` int(11) NOT NULL,
  `createdBy` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_bin NOT NULL,
  `description` varchar(255) COLLATE utf8_bin NOT NULL,
  `createdOn` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `gallery_albums`
--

INSERT INTO `gallery_albums` (`album_id`, `familyId`, `createdBy`, `title`, `description`, `createdOn`) VALUES
(3, 9, 1, 'Моята почивка', 'Моята почивка в Италия!', '2020-02-16 19:33:46');

-- --------------------------------------------------------

--
-- Table structure for table `gallery_photos`
--

CREATE TABLE `gallery_photos` (
  `photo_id` int(11) NOT NULL,
  `familyId` int(11) NOT NULL,
  `album_id` int(11) NOT NULL,
  `dateOfUploading` datetime NOT NULL,
  `photo_link` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `invitations`
--

CREATE TABLE `invitations` (
  `id` int(11) NOT NULL,
  `familyId` int(11) NOT NULL,
  `invitationCode` int(11) NOT NULL,
  `validFor` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `invitations`
--

INSERT INTO `invitations` (`id`, `familyId`, `invitationCode`, `validFor`) VALUES
(250, 9, 912465, '2020-02-08'),
(251, 9, 907913, '2020-02-08'),
(252, 9, 934591, '2020-02-08'),
(253, 9, 287419, '2020-02-08'),
(254, 9, 115756, '2020-02-08'),
(255, 9, 805877, '2020-02-08');

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `familyId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `text` varchar(1000) COLLATE utf8_bin NOT NULL,
  `senddate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `message`
--

INSERT INTO `message` (`id`, `familyId`, `userId`, `text`, `senddate`) VALUES
(51, 9, 1, '', '2020-02-16 09:17:17'),
(52, 9, 1, 'hey it\'s working', '2020-02-16 09:18:09'),
(53, 9, 1, 'test', '2020-02-29 05:30:15');

-- --------------------------------------------------------

--
-- Table structure for table `objects`
--

CREATE TABLE `objects` (
  `id` int(11) UNSIGNED NOT NULL,
  `familyId` int(11) NOT NULL,
  `title` varchar(100) COLLATE utf8_bin NOT NULL,
  `description` varchar(255) COLLATE utf8_bin NOT NULL,
  `lat` float(10,6) NOT NULL,
  `lng` float(10,6) NOT NULL,
  `color` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `objects`
--

INSERT INTO `objects` (`id`, `familyId`, `title`, `description`, `lat`, `lng`, `color`) VALUES
(1, 9, 'Home', 'My Home', 43.224148, 27.914013, 1),
(5, 9, 'School', 'My School', 43.217209, 27.939270, 2),
(6, 9, 'Fitness', 'My Fitness', 43.219585, 27.914286, 4),
(9, 9, 'English Class', 'My English class', 43.206898, 27.917702, 2);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `session_expire` int(11) UNSIGNED NOT NULL,
  `session_data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `typesofwork`
--

CREATE TABLE `typesofwork` (
  `id` int(11) NOT NULL,
  `type` varchar(10) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `typesofwork`
--

INSERT INTO `typesofwork` (`id`, `type`) VALUES
(1, 'one time'),
(2, 'daily'),
(3, 'workdays'),
(4, 'weekly'),
(5, 'monthly'),
(6, 'yearly');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserId` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_bin NOT NULL,
  `Email` varchar(200) COLLATE utf8_bin NOT NULL,
  `dateOfJoining` date NOT NULL,
  `Family` int(11) NOT NULL,
  `Birthday` date NOT NULL,
  `PhoneNumber` bigint(20) NOT NULL,
  `Password` varchar(250) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserId`, `Name`, `Email`, `dateOfJoining`, `Family`, `Birthday`, `PhoneNumber`, `Password`) VALUES
(1, 'Deyvid Popov', 'deyvidpopov18@gmail.com', '2020-02-05', 9, '2002-07-22', 359884407575, '$2a$10$D7VSjzKPlRT9XYazhVunzu3z7guNz25YAXg3RIqSCh6eqzkb8MIQe'),
(4, 'Galya Popova', 'agalia_popova@abv.bg', '2020-02-15', 9, '1971-02-19', 889402060, '$2a$10$MiUg0rNeUVcx.fmWclecbuiOuyTgDZEwnGYAr4flPVx.ru7P8R/Ai');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `calendar`
--
ALTER TABLE `calendar`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `calendarstatus`
--
ALTER TABLE `calendarstatus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `families`
--
ALTER TABLE `families`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gallery_albums`
--
ALTER TABLE `gallery_albums`
  ADD PRIMARY KEY (`album_id`);

--
-- Indexes for table `gallery_photos`
--
ALTER TABLE `gallery_photos`
  ADD PRIMARY KEY (`photo_id`);

--
-- Indexes for table `invitations`
--
ALTER TABLE `invitations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `objects`
--
ALTER TABLE `objects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `typesofwork`
--
ALTER TABLE `typesofwork`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `calendar`
--
ALTER TABLE `calendar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `calendarstatus`
--
ALTER TABLE `calendarstatus`
  MODIFY `id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `families`
--
ALTER TABLE `families`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `gallery_albums`
--
ALTER TABLE `gallery_albums`
  MODIFY `album_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `gallery_photos`
--
ALTER TABLE `gallery_photos`
  MODIFY `photo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `invitations`
--
ALTER TABLE `invitations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=257;

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `objects`
--
ALTER TABLE `objects`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `typesofwork`
--
ALTER TABLE `typesofwork`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

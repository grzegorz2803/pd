-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 09, 2025 at 05:44 PM
-- Wersja serwera: 10.4.28-MariaDB
-- Wersja PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lso`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `auth`
--

CREATE TABLE `auth` (
  `id_auth` int(11) NOT NULL,
  `card_id` varchar(20) NOT NULL,
  `login` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(150) NOT NULL,
  `role` enum('admin','moderator','user') NOT NULL,
  `user_function` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `parishes`
--

CREATE TABLE `parishes` (
  `id_parish` varchar(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parishes`
--

INSERT INTO `parishes` (`id_parish`, `name`, `location`) VALUES
('NSP002', 'Parafia pw. Najświętszego Serca Pana Jezusa', 'Żarnówka'),
('PRM001', 'Parafia pw. Przemienienia Pańskiego', 'Maków Podhalański');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `PRM001_services`
--

CREATE TABLE `PRM001_services` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `time_service` time NOT NULL,
  `date_service` date DEFAULT NULL,
  `day_of_month` int(11) DEFAULT NULL,
  `day_of_week` int(11) DEFAULT NULL,
  `first_friday` tinyint(1) DEFAULT 0,
  `first_saturday` tinyint(1) DEFAULT 0,
  `month_from` int(11) DEFAULT NULL,
  `month_to` int(11) DEFAULT NULL,
  `priority` int(11) NOT NULL,
  `points` int(11) DEFAULT 5
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `PRM001_services`
--

INSERT INTO `PRM001_services` (`id`, `name`, `time_service`, `date_service`, `day_of_month`, `day_of_week`, `first_friday`, `first_saturday`, `month_from`, `month_to`, `priority`, `points`) VALUES
(1, 'Środa Popielcowa - Msza Święta', '06:30:00', '2025-03-05', NULL, NULL, 0, 0, NULL, NULL, 1, 5),
(2, 'Środa Popielcowa - Msza Święta', '08:00:00', '2025-03-05', NULL, NULL, 0, 0, NULL, NULL, 1, 5),
(3, 'Środa Popielcowa - Msza Święta', '09:30:00', '2025-03-05', NULL, NULL, 0, 0, NULL, NULL, 1, 5),
(4, 'Środa Popielcowa - Msza Święta', '16:00:00', '2025-03-05', NULL, NULL, 0, 0, NULL, NULL, 1, 5),
(5, 'Środa Popielcowa - Msza Święta', '18:00:00', '2025-03-05', NULL, NULL, 0, 0, NULL, NULL, 1, 5),
(6, 'Wielki Czwartek - Liturgia Wieczerzy Pańskiej', '18:00:00', '2025-04-17', NULL, NULL, 0, 0, NULL, NULL, 1, 20),
(7, 'Wielki Piątek - Liturgia Męki Pańskiej', '18:00:00', '2025-04-18', NULL, NULL, 0, 0, NULL, NULL, 1, 20),
(8, 'Wielka Sobota - Liturgia Wigilii Paschalnej', '18:00:00', '2025-04-19', NULL, NULL, 0, 0, NULL, NULL, 1, 20),
(9, 'Wielkanoc - Msza Rezurekcyjna', '06:00:00', '2025-04-20', NULL, NULL, 0, 0, NULL, NULL, 1, 20),
(10, 'Poniedziałek Wielkanocny - Msza Święta', '06:30:00', '2025-04-21', NULL, NULL, 0, 0, NULL, NULL, 1, 5),
(11, 'Poniedziałek Wielkanocny - Msza Święta', '08:00:00', '2025-04-21', NULL, NULL, 0, 0, NULL, NULL, 1, 5),
(12, 'Poniedziałek Wielkanocny - Msza Święta', '09:30:00', '2025-04-21', NULL, NULL, 0, 0, NULL, NULL, 1, 5),
(13, 'Poniedziałek Wielkanocny - Msza Święta', '11:00:00', '2025-04-21', NULL, NULL, 0, 0, NULL, NULL, 1, 5),
(14, 'Poniedziałek Wielkanocny - Msza Święta', '13:00:00', '2025-04-21', NULL, NULL, 0, 0, NULL, NULL, 1, 5),
(15, 'Poniedziałek Wielkanocny - Msza Święta', '17:00:00', '2025-04-21', NULL, NULL, 0, 0, NULL, NULL, 1, 5),
(16, 'Boże Ciało - Msza Święta z Procesją', '09:30:00', '2025-06-19', NULL, NULL, 0, 0, NULL, NULL, 1, 20),
(17, 'Boże Ciało - Msza Święta', '06:30:00', '2025-06-19', NULL, NULL, 0, 0, NULL, NULL, 1, 5),
(18, 'Boże Ciało - Msza Święta', '08:00:00', '2025-06-19', NULL, NULL, 0, 0, NULL, NULL, 1, 5),
(19, 'Boże Ciało - Msza Święta', '11:00:00', '2025-06-19', NULL, NULL, 0, 0, NULL, NULL, 1, 5),
(20, 'Boże Ciało - Msza Święta', '13:00:00', '2025-06-19', NULL, NULL, 0, 0, NULL, NULL, 1, 5),
(21, 'Boże Ciało - Msza Święta', '17:00:00', '2025-06-19', NULL, NULL, 0, 0, NULL, NULL, 1, 5),
(22, 'Nowy Rok - Msza Święta', '06:30:00', NULL, 1, NULL, 0, 0, 1, 1, 2, 5),
(23, 'Nowy Rok - Msza Święta', '08:00:00', NULL, 1, NULL, 0, 0, 1, 1, 2, 5),
(24, 'Nowy Rok - Msza Święta', '09:30:00', NULL, 1, NULL, 0, 0, 1, 1, 2, 5),
(25, 'Nowy Rok - Msza Święta', '11:00:00', NULL, 1, NULL, 0, 0, 1, 1, 2, 5),
(26, 'Nowy Rok - Msza Święta', '13:00:00', NULL, 1, NULL, 0, 0, 1, 1, 2, 5),
(27, 'Nowy Rok - Msza Święta', '17:00:00', NULL, 1, NULL, 0, 0, 1, 1, 2, 5),
(28, 'Objawienie Pańskie - Msza Święta', '06:30:00', NULL, 6, NULL, 0, 0, 1, 1, 2, 5),
(29, 'Objawienie Pańskie - Msza Święta', '08:00:00', NULL, 6, NULL, 0, 0, 1, 1, 2, 5),
(30, 'Objawienie Pańskie - Msza Święta', '09:30:00', NULL, 6, NULL, 0, 0, 1, 1, 2, 5),
(31, 'Objawienie Pańskie - Msza Święta', '11:00:00', NULL, 6, NULL, 0, 0, 1, 1, 2, 5),
(32, 'Objawienie Pańskie - Msza Święta', '13:00:00', NULL, 6, NULL, 0, 0, 1, 1, 2, 5),
(33, 'Objawienie Pańskie - Msza Święta', '17:00:00', NULL, 6, NULL, 0, 0, 1, 1, 2, 5),
(34, 'Ofiarowanie Pańskie - Msza Święta', '06:30:00', NULL, 2, NULL, 0, 0, 2, 2, 2, 5),
(35, 'Ofiarowanie Pańskie - Msza Święta', '08:00:00', NULL, 2, NULL, 0, 0, 2, 2, 2, 5),
(36, 'Ofiarowanie Pańskie - Msza Święta', '09:30:00', NULL, 2, NULL, 0, 0, 2, 2, 2, 5),
(37, 'Ofiarowanie Pańskie - Msza Święta', '18:00:00', NULL, 2, NULL, 0, 0, 2, 2, 2, 5),
(38, 'Uroczystość Królowej Polski - Msza Święta', '06:30:00', NULL, 3, NULL, 0, 0, 5, 5, 2, 5),
(39, 'Uroczystość Królowej Polski - Msza Święta', '08:00:00', NULL, 3, NULL, 0, 0, 5, 5, 2, 5),
(40, 'Uroczystość Królowej Polski - Msza Święta', '09:30:00', NULL, 3, NULL, 0, 0, 5, 5, 2, 5),
(41, 'Uroczystość Królowej Polski - Msza Święta', '11:00:00', NULL, 3, NULL, 0, 0, 5, 5, 2, 5),
(42, 'Uroczystość Królowej Polski - Msza Święta', '13:00:00', NULL, 3, NULL, 0, 0, 5, 5, 2, 5),
(43, 'Uroczystość Królowej Polski - Msza Święta', '17:00:00', NULL, 3, NULL, 0, 0, 5, 5, 2, 5),
(44, 'Rocznica Koronacji - Odpust', '06:30:00', NULL, 10, NULL, 0, 0, 6, 6, 2, 5),
(45, 'Rocznica Koronacji - Odpust', '08:00:00', NULL, 10, NULL, 0, 0, 6, 6, 2, 5),
(46, 'Rocznica Koronacji - Odpust', '09:30:00', NULL, 10, NULL, 0, 0, 6, 6, 2, 5),
(47, 'Rocznica Koronacji - Odpust', '18:00:00', NULL, 10, NULL, 0, 0, 6, 6, 2, 5),
(48, 'Święto Przemienienia Pańskiego - Msza Święta', '06:30:00', NULL, 6, NULL, 0, 0, 8, 8, 2, 5),
(49, 'Święto Przemienienia Pańskiego - Msza Święta', '08:00:00', NULL, 6, NULL, 0, 0, 8, 8, 2, 5),
(50, 'Święto Przemienienia Pańskiego - Msza Święta', '09:30:00', NULL, 6, NULL, 0, 0, 8, 8, 2, 5),
(51, 'Święto Przemienienia Pańskiego - Msza Święta', '18:00:00', NULL, 6, NULL, 0, 0, 8, 8, 2, 5),
(52, 'Wniebowzięcie NMP - Msza Święta', '06:30:00', NULL, 15, NULL, 0, 0, 8, 8, 2, 5),
(53, 'Wniebowzięcie NMP - Msza Święta', '08:00:00', NULL, 15, NULL, 0, 0, 8, 8, 2, 5),
(54, 'Wniebowzięcie NMP - Msza Święta', '09:30:00', NULL, 15, NULL, 0, 0, 8, 8, 2, 5),
(55, 'Wniebowzięcie NMP - Msza Święta', '11:00:00', NULL, 15, NULL, 0, 0, 8, 8, 2, 5),
(56, 'Wniebowzięcie NMP - Msza Święta', '13:00:00', NULL, 15, NULL, 0, 0, 8, 8, 2, 5),
(57, 'Wniebowzięcie NMP - Msza Święta', '17:00:00', NULL, 15, NULL, 0, 0, 8, 8, 2, 5),
(58, 'Wszystkich Świętych - Msza Święta', '06:30:00', NULL, 1, NULL, 0, 0, 11, 11, 2, 5),
(59, 'Wszystkich Świętych - Msza Święta', '08:00:00', NULL, 1, NULL, 0, 0, 11, 11, 2, 5),
(60, 'Wszystkich Świętych - Msza Święta', '09:30:00', NULL, 1, NULL, 0, 0, 11, 11, 2, 5),
(61, 'Wszystkich Świętych - Msza Święta', '11:00:00', NULL, 1, NULL, 0, 0, 11, 11, 2, 5),
(62, 'Wszystkich Świętych - Msza Święta', '13:00:00', NULL, 1, NULL, 0, 0, 11, 11, 2, 5),
(63, 'Wszystkich Świętych - Msza Święta', '17:00:00', NULL, 1, NULL, 0, 0, 11, 11, 2, 5),
(64, 'Dzień Zaduszny - Msza Święta', '06:30:00', NULL, 2, NULL, 0, 0, 11, 11, 2, 5),
(65, 'Dzień Zaduszny - Msza Święta', '08:00:00', NULL, 2, NULL, 0, 0, 11, 11, 2, 5),
(66, 'Dzień Zaduszny - Msza Święta', '09:30:00', NULL, 2, NULL, 0, 0, 11, 11, 2, 5),
(67, 'Dzień Zaduszny - Msza Święta', '18:00:00', NULL, 2, NULL, 0, 0, 11, 11, 2, 5),
(68, 'Msza Święta w intencji Ojczyzny', '09:30:00', NULL, 11, NULL, 0, 0, 11, 11, 2, 5),
(69, 'Niepokalane Poczęcie NMP - Msza Święta', '06:30:00', NULL, 8, NULL, 0, 0, 12, 12, 2, 5),
(70, 'Niepokalane Poczęcie NMP - Msza Święta', '08:00:00', NULL, 8, NULL, 0, 0, 12, 12, 2, 5),
(71, 'Niepokalane Poczęcie NMP - Msza Święta', '09:30:00', NULL, 8, NULL, 0, 0, 12, 12, 2, 5),
(72, 'Niepokalane Poczęcie NMP - Msza Święta', '18:00:00', NULL, 8, NULL, 0, 0, 12, 12, 2, 5),
(73, 'Boże Narodzenie - Msza Święta', '06:30:00', NULL, 25, NULL, 0, 0, 12, 12, 2, 5),
(74, 'Boże Narodzenie - Msza Święta', '08:00:00', NULL, 25, NULL, 0, 0, 12, 12, 2, 5),
(75, 'Boże Narodzenie - Msza Święta', '09:30:00', NULL, 25, NULL, 0, 0, 12, 12, 2, 5),
(76, 'Boże Narodzenie - Msza Święta', '11:00:00', NULL, 25, NULL, 0, 0, 12, 12, 2, 5),
(77, 'Boże Narodzenie - Msza Święta', '13:00:00', NULL, 25, NULL, 0, 0, 12, 12, 2, 5),
(78, 'Boże Narodzenie - Msza Święta', '17:00:00', NULL, 25, NULL, 0, 0, 12, 12, 2, 5),
(79, 'Święto św. Szczepana - Msza Święta', '06:30:00', NULL, 26, NULL, 0, 0, 12, 12, 2, 5),
(80, 'Święto św. Szczepana - Msza Święta', '08:00:00', NULL, 26, NULL, 0, 0, 12, 12, 2, 5),
(81, 'Święto św. Szczepana - Msza Święta', '09:30:00', NULL, 26, NULL, 0, 0, 12, 12, 2, 5),
(82, 'Święto św. Szczepana - Msza Święta', '11:00:00', NULL, 26, NULL, 0, 0, 12, 12, 2, 5),
(83, 'Święto św. Szczepana - Msza Święta', '13:00:00', NULL, 26, NULL, 0, 0, 12, 12, 2, 5),
(84, 'Święto św. Szczepana - Msza Święta', '17:00:00', NULL, 26, NULL, 0, 0, 12, 12, 2, 5),
(85, 'Wszystkich Świętych - Procesja', '14:00:00', NULL, 1, NULL, 0, 0, 11, 11, 2, 20),
(86, 'Boże Narodzenie - Pasterka', '00:00:00', NULL, 25, NULL, 0, 0, 12, 12, 2, 20),
(87, 'Sylwester - Nieszpory', '16:00:00', NULL, 31, NULL, 0, 0, 12, 12, 2, 20),
(88, 'Sylwester - Msza Święta', '17:00:00', NULL, 31, NULL, 0, 0, 12, 12, 2, 5),
(89, 'Nowy Rok - Pasterka', '00:00:00', NULL, 1, NULL, 0, 0, 1, 1, 2, 20),
(90, 'Pierwszy Piątek Miesiąca - Msza Święta', '16:00:00', NULL, NULL, 5, 1, 0, NULL, NULL, 3, 5),
(91, 'Pierwsza Sobota Miesiąca - Msza Święta', '18:00:00', NULL, NULL, 6, 0, 1, NULL, NULL, 3, 15),
(92, 'Apel Jasnogórski', '20:15:00', NULL, 10, NULL, 0, 0, NULL, NULL, 4, 10),
(93, 'Nabożeństwo ku czci św. Józefa', '18:00:00', NULL, 19, NULL, 0, 0, NULL, NULL, 4, 10),
(94, 'Nabożeństwo ku czci św. Rity', '18:00:00', NULL, 22, NULL, 0, 0, NULL, NULL, 4, 10),
(95, 'Nabożeństwo Fatimskie', '18:00:00', NULL, 13, NULL, 0, 0, 5, 11, 4, 10),
(96, 'Nabożeństwo ku czci św. Józefa (niedziela)', '17:00:00', NULL, 19, 0, 0, 0, 1, 12, 4, 10),
(97, 'Nabożeństwo ku czci św. Rity (niedziela)', '17:00:00', NULL, 22, 0, 0, 0, 1, 12, 4, 10),
(98, 'Nabożeństwo Fatimskie (niedziela)', '17:00:00', NULL, 13, 0, 0, 0, 5, 11, 4, 10),
(99, 'Gorzkie Żale', '16:00:00', NULL, NULL, 0, 0, 0, 3, 4, 4, 10),
(100, 'Droga Krzyżowa', '17:15:00', NULL, NULL, 5, 0, 0, 3, 4, 4, 10),
(101, 'Droga Krzyżowa', '16:00:00', NULL, NULL, 5, 0, 0, 3, 4, 4, 10),
(102, 'Nabożeństwo Majowe', '18:00:00', NULL, NULL, NULL, 0, 0, 5, 5, 5, 10),
(103, 'Nabożeństwo Majowe (niedziela)', '16:30:00', NULL, NULL, 0, 0, 0, 5, 5, 5, 10),
(104, 'Nabożeństwo Czerwcowe', '18:00:00', NULL, NULL, NULL, 0, 0, 6, 6, 5, 10),
(105, 'Nabożeństwo Czerwcowe (niedziela)', '16:30:00', NULL, NULL, 0, 0, 0, 6, 6, 5, 10),
(106, 'Nabożeństwo Różańcowe', '17:15:00', NULL, NULL, NULL, 0, 0, 10, 10, 5, 10),
(107, 'Nabożeństwo Różańcowe (niedziela)', '16:15:00', NULL, NULL, 0, 0, 0, 10, 10, 5, 10),
(108, 'Roraty', '06:45:00', NULL, NULL, NULL, 0, 0, 12, 12, 5, 10),
(109, 'Nowenna do Matki Bożej Nieustającej Pomocy', '18:00:00', NULL, NULL, 3, 0, 0, NULL, NULL, 6, 10),
(110, 'Nowenna ku czci Matki Bożej Makowskiej', '08:00:00', NULL, NULL, 6, 0, 0, NULL, NULL, 6, 10),
(111, 'Msza Święta Niedzielna', '06:30:00', NULL, NULL, 0, 0, 0, NULL, NULL, 7, 5),
(112, 'Msza Święta Niedzielna', '08:00:00', NULL, NULL, 0, 0, 0, NULL, NULL, 7, 5),
(113, 'Msza Święta Niedzielna', '09:30:00', NULL, NULL, 0, 0, 0, NULL, NULL, 7, 5),
(114, 'Msza Święta Niedzielna', '11:00:00', NULL, NULL, 0, 0, 0, NULL, NULL, 7, 5),
(115, 'Msza Święta Niedzielna', '13:00:00', NULL, NULL, 0, 0, 0, NULL, NULL, 7, 5),
(116, 'Msza Święta Niedzielna', '17:00:00', NULL, NULL, 0, 0, 0, NULL, NULL, 7, 5),
(117, 'Msza Święta w dni powszednie', '06:30:00', NULL, NULL, NULL, 0, 0, NULL, NULL, 7, 5),
(118, 'Msza Święta w dni powszednie', '07:00:00', NULL, NULL, NULL, 0, 0, NULL, NULL, 7, 5),
(119, 'Msza Święta w dni powszednie', '08:00:00', NULL, NULL, NULL, 0, 0, NULL, NULL, 7, 5),
(120, 'Msza Święta w dni powszednie', '18:00:00', NULL, NULL, NULL, 0, 0, NULL, NULL, 7, 5);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `card_id` varchar(20) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `id_parish` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`card_id`, `first_name`, `last_name`, `id_parish`) VALUES
('1050177083521', 'Piotr', 'Wiśniewski', 'PRM001'),
('1050529798272', 'Jan', 'Kowalski', 'PRM001'),
('158653716531', 'Łukasz', 'Dąbrowski', 'PRM001'),
('292340078623', 'Marek', 'Nowak', 'PRM001'),
('293649553506', 'Krzysztof', 'Lewandowski', 'PRM001'),
('379492996124', 'Adam', 'Szymański', 'PRM001'),
('388204172907', 'Andrzej', 'Wójcik', 'PRM001'),
('430912739534', 'Tomasz', 'Kamiński', 'PRM001'),
('847578180774', 'Mateusz', 'Mazur', 'PRM001'),
('88040314991', 'Paweł', 'Zieliński', 'PRM001');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `auth`
--
ALTER TABLE `auth`
  ADD PRIMARY KEY (`id_auth`),
  ADD UNIQUE KEY `login` (`login`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `card_id` (`card_id`);

--
-- Indeksy dla tabeli `parishes`
--
ALTER TABLE `parishes`
  ADD PRIMARY KEY (`id_parish`);

--
-- Indeksy dla tabeli `PRM001_services`
--
ALTER TABLE `PRM001_services`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`card_id`),
  ADD KEY `id_parish` (`id_parish`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth`
--
ALTER TABLE `auth`
  MODIFY `id_auth` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PRM001_services`
--
ALTER TABLE `PRM001_services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth`
--
ALTER TABLE `auth`
  ADD CONSTRAINT `auth_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `users` (`card_id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_parish`) REFERENCES `parishes` (`id_parish`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

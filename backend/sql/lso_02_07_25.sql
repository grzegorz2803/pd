-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Lip 02, 2025 at 02:58 PM
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
-- Struktura tabeli dla tabeli `about_app`
--

CREATE TABLE `about_app` (
  `id` int(11) NOT NULL,
  `app_name` varchar(100) NOT NULL,
  `version` varchar(20) DEFAULT NULL,
  `author_name` varchar(100) NOT NULL,
  `author_email` varchar(100) DEFAULT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `website_note` text DEFAULT NULL,
  `description_app` text DEFAULT NULL,
  `description_author` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `about_app`
--

INSERT INTO `about_app` (`id`, `app_name`, `version`, `author_name`, `author_email`, `website_url`, `website_note`, `description_app`, `description_author`) VALUES
(1, 'LSOgo', '1.0.0', 'Grzegorz Listwan', 'kontakt@lsogo.pl', 'https://lsogo.pl', 'Więcej informacji o aplikacji, aktualizacjach i dokumentacji znajdziesz na stronie internetowej.', 'LSOgo to nowoczesna aplikacja wspierająca organizację pracy Liturgicznej Służby Ołtarza w parafii. System umożliwia łatwe zarządzanie harmonogramem służb, punktacją za obecność, wydarzeniami liturgicznymi i komunikacją wewnętrzną. Składa się z aplikacji mobilnej, aplikacji webowej oraz urządzenia opartego na Raspberry Pi, które odczytuje karty RFID ministrantów. Dzięki temu animatorzy mogą szybko rejestrować obecność, a wszyscy członkowie mają dostęp do potrzebnych informacji liturgicznych i systemu punktowego.', 'Nazywam się Grzegorz Listwan. Od wielu lat mam bezpośredni kontakt z Liturgiczną Służbą Ołtarza i dobrze rozumiem codzienne wyzwania związane z jej organizacją — zwłaszcza w zakresie prowadzenia punktacji, grafików i frekwencji. Jako informatyk i inżynier informatyki postanowiłem stworzyć system, który w prosty i nowoczesny sposób usprawni pracę animatora oraz opiekuna LSO. LSOgo to owoc tej pasji i doświadczenia.');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `auth`
--

CREATE TABLE `auth` (
  `id_auth` int(11) NOT NULL,
  `card_id` varchar(20) NOT NULL,
  `login` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `role` enum('admin','moderator','user') NOT NULL,
  `user_function` varchar(100) DEFAULT NULL,
  `is_email_verified` tinyint(1) DEFAULT 0,
  `first_login_completed` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth`
--

INSERT INTO `auth` (`id_auth`, `card_id`, `login`, `password_hash`, `email`, `role`, `user_function`, `is_email_verified`, `first_login_completed`, `created_at`) VALUES
(1, '1050177083521', 'piotr.wis', '$2b$10$PRWS2cIpl/.IknuYz9H.p.2oDI4lrg6lkcs/HHT8klOWI2cQ/U9ny', '', 'user', 'ministrant', 0, 0, '2025-05-20 14:46:09'),
(3, '1050529798272', 'jan.kow', '$2b$10$tS/k26CGpIGk.BTEtI.kkOw/nflskkFu63UmdJjtQ0YfLUwBBPotW', 'cmentarzmakow@gmail.com', 'user', 'ministrant', 1, 1, '2025-05-20 15:25:03'),
(4, '158653716531', 'lukasz.dab', '$2b$10$scQiYog0XlevrNS2dZzZ.OtXhtirEVYz5geAmUjt/kdk1fMnyuF3m', 'wp@wp.pl', 'user', 'ministrant', 0, 0, '2025-05-20 14:48:49'),
(5, '292340078623', 'marek.now', '$2b$10$nbHkcKbhJHQ07xuRsb5DMesl7BElt1OfSthLTF5wB/pC0WNrB3tzG', 'wp@wpp.pl', 'user', 'ministrant', 1, 1, '2025-05-20 14:49:26'),
(6, '293649553506', 'krzysztof.lew', '$2b$10$K808mzBQVLF8fbcs2EaPHeHrBOBrjABjsXqSwexhfBMvwfM9Lyga.', '', 'user', 'ministrant', 0, 0, '2025-05-20 14:50:13'),
(7, '379492996124', 'adam.szym', '$2b$10$zhI4iROVdtpVXh4RAUbuYuDsBBlezon7jTnDA/.wuceiqeMfkjTRi', '', 'user', 'lektor', 0, 0, '2025-05-20 14:50:58'),
(8, '388204172907', 'andrzej.woj', '$2b$10$76J7d4zyAZ7tPQ0pSyAhLeizyIyLDCC8pnx3m.aehhDESdnyHdQqO', '', 'user', 'lektor', 0, 0, '2025-05-20 14:51:30'),
(9, '430912739534', 'tomasz.kam', '$2b$10$iC1uUasZuWT7vaZRk.L82ec0CdXGokhdtO3utidwgkQWe60z89VN2', '', 'user', 'lektor', 0, 0, '2025-05-20 14:52:04'),
(10, '847578180774', 'mateusz.maz', '$2b$10$Bk9cgdczXasUS4VuPCiFVOBHf3b.IKgdJX6xhSsVPn3v5tcenEQvm', '', 'user', 'lektor', 0, 0, '2025-05-20 14:52:38'),
(11, '88040314991', 'pawel.zie', '$2b$10$H0WD0fet11n4eRtjOKctGORt/lvAatKhbiXXc20T76.iEplgU0Upy', 'listwan94@gmail.com', 'moderator', 'lektor', 1, 1, '2025-05-20 14:53:35');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `calendar_tools`
--

CREATE TABLE `calendar_tools` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `day_name` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `sigla` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `priority_level` enum('solemnity','feast','memorial','optional_memorial','ferial') NOT NULL DEFAULT 'ferial'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `calendar_tools`
--

INSERT INTO `calendar_tools` (`id`, `date`, `day_name`, `name`, `color`, `sigla`, `notes`, `priority_level`) VALUES
(1, '2025-05-01', 'Czwartek', 'dzień powszedni', 'biały', 'Dz 5, 27-33; Ps 34(33), 2 i 9. 17-18. 19-20; J 3, 31-36', 'pierwszy czwartek', 'ferial'),
(2, '2025-05-01', 'czwartek', 'wspomnienie dowolne św. Józefa, rzemieślnika', 'biały', '', '', 'optional_memorial'),
(3, '2025-05-02', 'Piątek', 'wspomnienie św. Atanazego, biskupa i doktora Kościoła', 'biały', 'Dz 5, 34-42; Ps 27(26), 1bcd.e.4.13-14; J 6, 1-15', 'pierwszy piątek miesiąca', 'memorial'),
(4, '2025-05-03', 'Sobota', 'Uroczystość Najświętszej Maryi Panny Królowej Polski, głównej patronki Polski', 'biały', 'Ap 11, 19a; 12, 1. 3-6a. 10ab; Jdt 13, 18bcd.e.19-20a; Kol 1, 12-16; J 19, 25-27', 'pierwsza sobota', 'solemnity'),
(5, '2025-05-04', 'Niedziela', '3. Niedziela Wielkanocna', 'biały', 'Dz 2, 14. 22b-28; Ps 16(15), 1-2a i 5. 7-8. 9-10. 11; 1 P 1, 17-21; Łk 24, 13-35', '', 'solemnity'),
(6, '2025-05-05', 'Poniedziałek', 'Wspomnienie św. STanisława Kazimierczyka, prezbitera', 'biały', 'Dz 6, 8-15; Ps 119(118), 23-24. 26-27. 29-30; J 6, 22-29', '', 'memorial'),
(7, '2025-05-06', 'Wtorek', 'święto świętych Apostołów Filipa i Jakuba', 'czerwony', '1 Kor 15, 1-8; Ps 19(18), 2-3. 4-5; J 14, 6-14', '', 'feast'),
(8, '2025-05-07', 'Środa', 'dzień powszedni', 'biały', 'Dz 8, 1b-8; Ps 66(65), 1-3a. 4-5. 6-7a; J 6, 35-40', '', 'ferial'),
(9, '2025-05-08', 'Czwartek', 'Uroczystość św. Stanisława, biskupa i męczennika, głównego patrona Polski', 'czerwony', 'Mdr 4, 7-15; Ps 34(33), 2-3. 4-5. 6-7. 8-9; Flp 3, 8-14; J 10, 11-16', '', 'solemnity'),
(10, '2025-05-09', 'Piątek', 'dzień powszedni', 'biały', 'Dz 9, 1-20; Ps 117(116), 1. 2; J 6, 52-59', '', 'ferial'),
(11, '2025-05-10', 'Sobota', 'dzień powszedni', 'biały', 'Dz 9, 31-42; Ps 116B(115), 12-13. 14-15. 16-17; J 6, 60-69', '', 'ferial'),
(12, '2025-05-10', 'Sobota', 'wspomnienie dowolne św. Jana z Ávili, prezbitera i doktora Kościoła', 'biały', '', '', 'optional_memorial'),
(13, '2025-05-11', 'Niedziela', '4. Niedziela Wielkanocna', 'biały', 'Dz 4, 8-12; Ps 118(117), 1 i 8-9. 21-23. 26 i 28cd i 29; 1 J 3, 1-2; J 10, 11-18', 'Niedziela Dobrego Pasterza', 'solemnity'),
(14, '2025-05-12', 'Poniedziałek', 'dzień powszedni', 'biały', 'Dz 11, 1-18; Ps 42(41), 2-3; 43(42), 3. 4; J 10, 1-10', '', 'ferial'),
(15, '2025-05-12', 'Poniedziałek', 'wspomnienie dowolne bł. Michała Rapacza, prezbitera, męczennika', 'czerwony', '', '', 'optional_memorial'),
(16, '2025-05-12', 'Poniedziałek', 'wspomnienie dowolne św. Pankracego, męczennika', 'czerwony', '', '', 'optional_memorial'),
(17, '2025-05-12', 'Poniedziałek', 'wspomnienie dowolne św. Nereusza i Achillesa, męczenników', 'czerwony', '', '', 'optional_memorial'),
(18, '2025-05-13', 'Wtorek', 'dzień powszedni', 'biały', 'Dz 11, 19-26; Ps 87(86), 1-3. 4-5. 6-7; J 10, 22-30', '', 'ferial'),
(19, '2025-05-13', 'Wtorek', 'Wspomnienie dowolne Najświętszej Maryi Panny Fatimskiej', 'biały', '', '', 'optional_memorial'),
(20, '2025-05-14', 'Środa', 'święto św. Macieja, apostoła', 'czerwony', 'Dz 1, 15-17. 20-26; Ps 113(112), 1-2. 3-4. 5-6. 7-8; J 15, 9-17', '', 'feast'),
(21, '2025-05-15', 'Czwartek', 'dzień powszedni', 'biały', 'Dz 13, 13-25; Ps 89(88), 2-3. 21-22. 25 i 27; J 13, 16-20', '', 'ferial'),
(22, '2025-05-15', 'Czwartek', 'wspomnienie dowolne św. Zofii Czeski, zakonnicy', 'biały', '', '', 'optional_memorial'),
(23, '2025-05-16', 'piątek', 'święto św. Andrzeja Boboli, prezbitera i męczennika, patrona Polski', 'czerwony', '1 Kor 1, 10-13. 17; Ps 34(33), 2-3. 4-5. 6-7. 8-9; J 17, 20-26', '', 'feast'),
(24, '2025-05-17', 'Sobota', 'dzień powszedni', 'biały', 'Dz 13, 44-52; Ps 98(97), 1-2ab. 2cd-3ab. 3cd-4; J 14, 7-14', '', 'ferial'),
(25, '2025-05-18', 'Niedziela', '5. Niedziela Wielkanocna', 'biały', 'Dz 9, 26-31; Ps 22(21), 26b-27. 28 i 30ab. 30c-32; 1 J 3, 18-24; J 15, 1-8', '', 'solemnity'),
(26, '2025-05-19', 'Poniedziałek', 'dzień powszedni', 'biały', 'Dz 14, 5-18; Ps 115(113B), 1-2. 3-4. 15-16; J 14, 21-26', '', 'ferial'),
(27, '2025-05-20', 'Wtorek', 'dzień powszedni', 'biały', 'Dz 14, 19-28; Ps 145(144), 10-11. 12-13ab. 21; J 14, 27-31a', '', 'ferial'),
(28, '2025-05-20', 'Wtorek', 'wspomnienie dowolne św. Bernardyna ze Sieny, prezbitera', 'biały', '', '', 'optional_memorial'),
(29, '2025-05-21', 'Środa', 'dzień powszedni', 'biały', 'Dz 15, 1-6; Ps 122(121), 1-2. 3-4a. 4b-5; J 15, 1-8', '', 'ferial'),
(30, '2025-05-21', 'środa', 'wspomnienie dowolne św. Jana Nepomucena, prezbitera i męczennika', 'czerwony', '', '', 'optional_memorial'),
(31, '2025-05-22', 'Czwartek', 'dzień powszedni', 'biały', 'Dz 15, 7-21; Ps 96(95), 1-2a. 2b-3. 10; J 15, 9-11', 'rocznica święceń kapłańskich 1977, 1983, 1988', 'ferial'),
(32, '2025-05-22', 'Czwartek', 'wspomnienie dowolne św. Rity z Cascii, zakonnicy', 'biały', '', '', 'optional_memorial'),
(33, '2025-05-23', 'Piątek', 'dzień powszedni', 'biały', 'Dz 15, 22-31; Ps 57(56), 8-9. 10-11. 12; J 15, 12-17', '', 'ferial'),
(34, '2025-05-24', 'sobota', 'Wspomnienie Najświętszej Maryi Panny Wspomożycielki Wiernych', 'biały', 'Dz 16, 1-10; Ps 100(99), 1-2. 3. 5; J 15, 18-21', '', 'memorial'),
(35, '2025-05-25', 'Niedziela', '6. Niedziela Wielkanocna', 'biały', 'Dz 10, 25-26. 34-35. 44-48; Ps 98(97), 1. 2-3ab. 3cd-4; 1 J 4, 7-10; J 15, 9-17', '', 'solemnity'),
(36, '2025-05-26', 'Poniedziałek', 'wspomnienie św. Filipa Nereusza, prezbitera', 'biały', 'Dz 16, 11-15; Ps 149, 1-2. 3-4. 5-6a i 9b; J 15, 26 – 16, 4a', 'Dzień Matki', 'memorial'),
(37, '2025-05-27', 'Wtorek', 'dzień powszedni', 'biały', 'Dz 16, 22-34; Ps 138(137), 1-2a. 2bc-3. 7c-8; J 16, 5-11', '', 'ferial'),
(38, '2025-05-27', 'Wtorek', 'wspomnienie dowolne św. Augustyna z Canterbury, biskupa', 'biały', '', '', 'optional_memorial'),
(39, '2025-05-28', 'Środa', 'dzień powszedni', 'biały', 'Dz 17, 15. 22 – 18, 1; Ps 148, 1-2. 11-12. 13. 14; J 16, 12-15', '', 'ferial'),
(40, '2025-05-29', 'Czwartek', 'Wspomnienie św. Urszuli Ledóchowskiej, dziewicy', 'biały', 'Dz 18, 1-8; Ps 98(97), 1. 2-3ab. 3cd-4; J 16, 16-20', '', 'memorial'),
(41, '2025-05-30', 'Piątek', 'dzień powszedni', 'biały', 'Dz 18, 9-18; Ps 47(46), 2-3. 4-5. 6-7; J 16, 20-23a', '', 'ferial'),
(42, '2025-05-30', 'Piątek', 'wspomnienie dowolne św. Jana Sarkanda, prezbitera i męczennika', 'czerwony', '', '', 'optional_memorial'),
(43, '2025-05-30', 'Piątek', 'wspomnienie dowolne św. Zdzisławy', 'biały', '', '', 'optional_memorial'),
(44, '2025-05-31', 'Sobota', 'święto Nawiedzenia Najświętszej Maryi Panny', 'biały', 'So 3, 14-18a albo Rz 12, 9-16b; Iz 12, 2. 3 i 4bcd. 5-6; Łk 1, 39-56', '', 'feast'),
(45, '2025-06-01', 'Niedziela', '7. Niedziela Wielkanocna – Uroczystość Wniebowstąpienia Pańskiego', 'biały', 'Dz 1, 1-11; Ps 47(46), 2-3. 6-7. 8-9; Ef 1, 17-23; Mk 16, 15-20', 'Uroczystość Wniebowstąpienia Pańskiego', 'solemnity'),
(46, '2025-06-02', 'Poniedziałek', 'Wspomnienie świętych Marcelego i Piotra, męczenników', 'czerwony', 'Dz 19, 1-8; Ps 68(67), 2-3. 4-5ac. 6-7b; J 16, 29-33', 'Rocznica święceń kapłańskich 1999, 2001, 2007', 'memorial'),
(47, '2025-06-03', 'Wtorek', 'Wspomnienie św. Karola Lwangi i towarzyszy, męczenników', 'czerwony', 'Dz 20, 17-27; Ps 68(67), 10-11. 20-21; J 17, 1-11a', 'Rocznica święceń kapłańskich 2006; nominacja kard. Dziwisza na arcybiskupa Krakowa (2005)', 'memorial'),
(48, '2025-06-04', 'Środa', 'Dzień powszedni', 'biały', 'Dz 20, 28-38; Ps 68(67), 29-30. 33-35a. 35bc-36b; J 17, 11b-19', 'Rocznica święceń kapłańskich 2005; rocznica święceń biskupich bp. Skodonia (1988)', 'ferial'),
(49, '2025-06-05', 'Czwartek', 'Dzień powszedni', 'biały', 'Dz 22, 30; 23, 6-11; Ps 16(15), 1-2a i 5. 7-8. 9-10. 11; J 17, 20-26', 'Pierwszy czwartek; rocznica święceń kapłańskich 2004', 'ferial'),
(50, '2025-06-05', 'Czwartek', 'Wspomnienie dowolne św. Bonifacego, biskupa i męczennika', 'czerwony', 'Dz 22, 30; 23, 6-11; Ps 16(15), 1-2a i 5. 7-8. 9-10. 11; J 17, 20-26', '', 'optional_memorial'),
(51, '2025-06-05', 'Czwartek', 'Wspomnienie dowolne bł. Małgorzaty Łucji Szewczyk, dziewicy', 'biały', 'Dz 22, 30; 23, 6-11; Ps 16(15), 1-2a i 5. 7-8. 9-10. 11; J 17, 20-26', '', 'optional_memorial'),
(52, '2025-06-06', 'Piątek', 'Dzień powszedni', 'biały', 'Dz 25, 13-21; Ps 103(102), 1-2. 11-12. 19-20ab; J 21, 15-19', 'Pierwszy piątek; Hołd UPJP II; rocznica święceń kapłańskich 1998', 'ferial'),
(53, '2025-06-06', 'Piątek', 'Wspomnienie dowolne św. Norberta, biskupa', 'biały', 'Dz 25, 13-21; Ps 103(102), 1-2. 11-12. 19-20ab; J 21, 15-19', '', 'optional_memorial'),
(54, '2025-06-07', 'Sobota', 'Dzień powszedni', 'biały', 'Dz 28, 16-20. 30-31; Ps 11(10), 4-5. 7; J 21, 20-25', 'Pierwsza sobota; pielgrzymki; rocznica święceń kapłańskich 2003', 'ferial'),
(55, '2025-06-07', 'Sobota', 'Wspomnienie dowolne bł. Zbigniewa Strzałkowskiego i Michała Tomaszka, męczenników franciszkańskich', 'czerwony', 'Dz 28, 16-20. 30-31; Ps 11(10), 4-5. 7; J 21, 20-25', '', 'optional_memorial'),
(56, '2025-06-08', 'Niedziela', 'Uroczystość Zesłania Ducha Świętego', 'czerwony', 'Dz 2, 1-11; Ps 104(103), 1ab i 24ac. 29bc-30. 31 i 34; 1 Kor 12, 3b-7. 12-13 lub Ga 5, 16-25; J 20, 19-23 lub J 15, 26-27; 16, 12-15', 'Zamyka okres wielkanocny. Wigilia (wieczorem) z czytaniami własnymi. Rocznice święceń bp. Janusza Mastalskiego (2019), bp. Janusza Szubera (2000)', 'solemnity'),
(60, '2025-06-09', 'Poniedziałek', 'Święto Najświętszej Maryi Panny, Matki Kościoła', 'biały', 'Rdz 3, 9-15. 20 lub Dz 1, 12-14; Ps 87(86), 1-2. 3 i 5. 6-7; J 19, 25-34', 'Msza własna. Można odczytać drugie czytanie z formularza: Dz 1, 12-14. Wspomnienie św. Efrema, diakona i doktora Kościoła', 'feast'),
(61, '2025-06-10', 'Wtorek', 'Dzień powszedni', 'zielony', '2 Kor 1, 18-22; Ps 119(118), 129 i 130. 131 i 132. 133 i 135; Mt 5, 13-16', 'Rocznica święceń kapłańskich 1954, 2000', 'ferial'),
(62, '2025-06-11', 'Środa', 'Wspomnienie św. Barnaby, apostoła', 'czerwony', 'Dz 11, 21b-26; 13, 1-3; Ps 98(97), 1. 2-3ab. 3cd-4. 5-6; Mt 10, 7-13', '', 'memorial'),
(63, '2025-06-12', 'Czwartek', 'Święto Jezusa Chrystusa Najwyższego i Wiecznego Kapłana', 'biały', '2 Kor 3, 15 – 4, 1. 3-6; Ps 85(84), 9ab i 10. 11-12. 13-14; Mt 5, 20-26', '', 'solemnity'),
(64, '2025-06-13', 'Piątek', 'Wspomnienie św. Antoniego z Padwy, prezbitera i doktora Kościoła', 'biały', '2 Kor 4, 7-15; Ps 116B(115), 10-11. 15-16ac. 17-18; Mt 5, 27-32', '', 'memorial'),
(65, '2025-06-14', 'Sobota', 'Wspomnienie dowolne bł. Michała Kozala, biskupa i męczennika', 'czerwony', '2 Kor 5, 14-21; Ps 103(102), 1-2. 3-4. 9-10. 11-12; Mt 5, 33-37', '', 'memorial'),
(66, '2025-06-15', 'Niedziela', 'Uroczystość Najświętszej Trójcy', 'biały', 'Wj 34, 4b-6. 8-9; Dn 3, 52-56; 2 Kor 13, 11-13; J 3, 16-18', '', 'solemnity'),
(67, '2025-06-16', 'Poniedziałek', 'Dzień powszedni', 'zielony', '2 Kor 6, 1-10; Ps 98(97), 1. 2-3ab. 3cd-4; Mt 5, 38-42', '', 'ferial'),
(68, '2025-06-17', 'Wtorek', 'Dzień powszedni', 'zielony', '2 Kor 8, 1-9; Ps 146(145), 2. 5-6. 7. 8-9a; Mt 5, 43-48', 'Rocznica święceń kapłańskich 1992', 'ferial'),
(69, '2025-06-18', 'Środa', 'Dzień powszedni', 'zielony', '2 Kor 9, 6-11; Ps 112(111), 1-2. 3-4. 9; Mt 6, 1-6. 16-18', 'Wspomnienie dowolne o Najdroższej Krwi Chrystusa; teksty własne – LG s. 473; MR, s. 276', 'ferial'),
(70, '2025-06-19', 'Czwartek', 'Uroczystość Najświętszego Ciała i Krwi Chrystusa (Boże Ciało)', 'biały', 'Pwt 8, 2-3. 14b-16a; Ps 147B(147), 12-13. 14-15. 19-20; 1 Kor 10, 16-17; J 6, 51-58', 'Msza własna: „Chwała”, „Wierzę”, Prefacja o Eucharystii; procesja eucharystyczna po Mszy; rocznice święceń 2009 i 2015', 'solemnity'),
(71, '2025-06-20', 'Piątek', 'Dzień powszedni', 'zielony', '2 Kor 11, 18. 21b-30; Ps 34(33), 2-3. 4-5. 6-7; Mt 6, 19-23', 'Dzień Pamięci Ofiar Auschwitz; urodziny bp. Jana Zająca (1939)', 'ferial'),
(72, '2025-06-20', 'Piątek', 'Wspomnienie dowolne bł. Władysława Bukowińskiego, prezbitera', 'biały', '2 Kor 11, 18. 21b-30; Ps 34(33), 2-3. 4-5. 6-7; Mt 6, 19-23', '', 'optional_memorial'),
(73, '2025-06-21', 'Sobota', 'Wspomnienie św. Alojzego Gonzagi, zakonnika', 'biały', '2 Kor 12, 1-10; Ps 34(33), 8-9. 10-11. 12-13; Mt 6, 24-34', 'Rocznica święceń kapłańskich 1964; I nieszpory z 12. niedzieli zwykłej; Psalterz IV tyg.', 'memorial'),
(74, '2025-06-22', 'Niedziela', '12. Niedziela zwykła', 'zielony', 'Jr 20, 10-13; Ps 69(68), 8-10. 14 i 17. 33-35; Rz 5, 12-15; Mt 10, 26-33', 'Rocznica święceń kapłańskich 1985, 1991, 2012', 'ferial'),
(75, '2025-06-23', 'Poniedziałek', 'Dzień powszedni', 'zielony', 'Rdz 12, 1-9; Ps 33(32), 12-13. 18-19. 20 i 22; Mt 7, 1-5', 'Rocznica święceń kapłańskich 1963, 1985, 1987, 1990; wspomnienie dowolne św. Józefa Cafasso', 'ferial'),
(76, '2025-06-23', 'Poniedziałek', 'Wspomnienie dowolne św. Józefa Cafasso, prezbitera', 'biały', 'Rdz 12, 1-9; Ps 33(32), 12-13. 18-19. 20 i 22; Mt 7, 1-5', '', 'optional_memorial'),
(77, '2025-06-24', 'Wtorek', 'Uroczystość Narodzenia św. Jana Chrzciciela', 'biały', 'Iz 49, 1-6; Ps 139(138), 1-3. 13-14ab. 14c-15; Dz 13, 22-26; Łk 1, 57-66. 80', 'Msza własna: „Chwała”, „Wierzę”; Prefacja o św. Janie Chrzcicielu; rocznica święceń 1958, 1983, 1984, 1986; imieniny bp. Jana Szkodonia i bp. Jana Zająca', 'solemnity'),
(78, '2025-06-25', 'Środa', 'Dzień powszedni', 'zielony', 'Rdz 15, 1-12. 17-18; Ps 105(104), 1-2. 3-4. 6-7. 8-9; Mt 7, 15-20', 'Rocznica święceń kapłańskich 1961', 'ferial'),
(79, '2025-06-26', 'Czwartek', 'Dzień powszedni', 'zielony', 'Rdz 16, 1-12. 15-16; Ps 106(105), 1-2. 3-4a. 4b-5; Mt 7, 21-29', '', 'ferial'),
(80, '2025-06-26', 'Czwartek', 'Wspomnienie dowolne św. Josemarii Escrivy de Balaguera, prezbitera', 'biały', 'Rdz 16, 1-12. 15-16; Ps 106(105), 1-2. 3-4a. 4b-5; Mt 7, 21-29', '', 'optional_memorial'),
(81, '2025-06-26', 'Czwartek', 'Wspomnienie dowolne bł. Doroty z Mątowów, wdowy', 'biały', 'Rdz 16, 1-12. 15-16; Ps 106(105), 1-2. 3-4a. 4b-5; Mt 7, 21-29', '', 'optional_memorial'),
(82, '2025-06-27', 'Piątek', 'Uroczystość Najświętszego Serca Pana Jezusa', 'biały', 'Oz 11, 1. 3-4. 8c-9; Iz 12, 2. 3-4bcd. 5-6; Ef 3, 8-12. 14-19; J 19, 31-37', 'Msza własna: „Chwała”, „Wierzę”, Prefacja o Sercu Pana Jezusa; Akt poświęcenia rodzaju ludzkiego; rocznica święceń kapłańskich 1954', 'solemnity'),
(83, '2025-06-28', 'Sobota', 'Wspomnienie Niepokalanego Serca Najświętszej Maryi Panny', 'biały', 'Iz 61, 9-11; 1 Sm 2, 1. 4-5. 6-7. 8abcd; Łk 2, 41-51', 'Rocznica święceń kapłańskich 1953; wspomnienie świętych apostołów Piotra i Pawła przeniesione na 29 czerwca', 'memorial'),
(84, '2025-06-29', 'Niedziela', 'Uroczystość Świętych Apostołów Piotra i Pawła', 'czerwony', 'Dz 12, 1-11; Ps 34(33), 2-3. 4-5. 6-7. 8-9; 2 Tm 4, 6-8. 17-18; Mt 16, 13-19', 'Msza uroczysta z „Chwała”, „Wierzę”; Prefacja własna. Przeniesiona uroczystość; rocznica święceń bp. Marka Jędraszewskiego (1997); inne rocznice święceń i biskupich.', 'solemnity'),
(85, '2025-06-30', 'Poniedziałek', 'Dzień powszedni', 'zielony', 'Rdz 18, 16-33; Ps 103(102), 1-2. 3-4. 8-9. 10-11; Mt 8, 18-22', 'Zakończenie nabożeństw czerwcowych; rocznice święceń 1957', 'ferial'),
(86, '2025-06-30', 'Poniedziałek', 'Wspomnienie dowolne świętych pierwszych męczenników Kościoła rzymskiego', 'czerwony', 'Rdz 18, 16-33; Ps 103(102), 1-2. 3-4. 8-9. 10-11; Mt 8, 18-22', '', 'optional_memorial'),
(87, '2025-07-01', 'Wtorek', 'Dzień powszedni', 'zielony', 'Rdz 19, 15-29; Ps 26(25), 2-3. 9-10. 11-12; Mt 8, 23-27', 'Początek miesiąca Najdroższej Krwi Chrystusa', 'ferial'),
(88, '2025-07-01', 'Wtorek', 'Wspomnienie dowolne św. Ottona, biskupa', 'biały', 'Rdz 19, 15-29; Ps 26(25), 2-3. 9-10. 11-12; Mt 8, 23-27', '', 'optional_memorial'),
(89, '2025-07-02', 'Środa', 'Dzień powszedni', 'zielony', 'Rdz 21, 5. 8-20; Ps 34(33), 7-8. 10-11. 12-13; Mt 8, 28-34', '', 'ferial'),
(90, '2025-07-03', 'Czwartek', 'Święto św. Tomasza, apostoła', 'czerwony', 'Ef 2, 19-22; Ps 117(116), 1bc. 2; J 20, 24-29', 'Msza ze święta: „Chwała”, własne czytania; pierwszy czwartek miesiąca – wotywa o kapłaństwo', 'feast'),
(91, '2025-07-04', 'Piątek', 'Rocznica poświęcenia Bazyliki Metropolitalnej w Krakowie', 'biały', '1 Krl 8, 22-23. 27-30; Ps 84(83), 3. 4. 5 i 10. 11; Mt 16, 13-19', 'Uroczystości lokalne w archidiecezji krakowskiej; Msza z formularza o poświęceniu kościoła', 'feast'),
(92, '2025-07-05', 'Sobota', 'Dzień powszedni', 'zielony', 'Rdz 27, 1-5. 15-29; Ps 135(134), 1-2. 3-4. 5-6; Mt 9, 14-17', 'Pierwsza sobota miesiąca', 'ferial'),
(93, '2025-07-05', 'Sobota', 'Wspomnienie dowolne św. Antoniego Marii Zaccarii, prezbitera', 'biały', 'Rdz 27, 1-5. 15-29; Ps 135(134), 1-2. 3-4. 5-6; Mt 9, 14-17', '', 'optional_memorial'),
(94, '2025-07-05', 'Sobota', 'Wspomnienie dowolne św. Marii Goretti, dziewicy i męczennicy', 'czerwony', 'Rdz 27, 1-5. 15-29; Ps 135(134), 1-2. 3-4. 5-6; Mt 9, 14-17', '', 'optional_memorial'),
(95, '2025-07-05', 'Sobota', 'Wspomnienie dowolne św. Elżbiety Portugalskiej, królowej', 'biały', 'Rdz 27, 1-5. 15-29; Ps 135(134), 1-2. 3-4. 5-6; Mt 9, 14-17', '', 'optional_memorial'),
(96, '2025-07-06', 'Niedziela', '14. Niedziela zwykła', 'zielony', 'Ez 2, 2-5; Ps 123(122), 1-2. 3-4; 2 Kor 12, 7-10; Mk 6, 1-6', 'Pierwsza niedziela miesiąca – adoracja Najświętszego Sakramentu; wspomnienie bł. Marii Teresy Ledóchowskiej', 'ferial'),
(97, '2025-07-07', 'Poniedziałek', 'Dzień powszedni', 'zielony', 'Rdz 28, 10-22a; Ps 91(90), 1-2. 3-4. 14-15b; Mt 9, 18-26', '', 'ferial'),
(98, '2025-07-07', 'Poniedziałek', 'Wspomnienie dowolne błogosławionej rodziny Ulmów z Markowej', 'czerwony', 'Rdz 28, 10-22a; Ps 91(90), 1-2. 3-4. 14-15b; Mt 9, 18-26', '', 'optional_memorial'),
(99, '2025-07-08', 'Wtorek', 'Wspomnienie św. Jana z Dukli, prezbitera', 'biały', 'Rdz 32, 23-33; Ps 17(16), 1bcd. 2-3. 6-7ab. 8b i 15; Mt 9, 32-38', '', 'memorial'),
(100, '2025-07-09', 'Środa', 'Dzień powszedni', 'zielony', 'Rdz 41, 55-57; 42, 5-7a. 17-24a; Ps 33(32), 2-3. 10-11. 18-19; Mt 10, 1-7', '', 'ferial'),
(101, '2025-07-09', 'Środa', 'Wspomnienie dowolne św. Augustyna Zhao Ronga, prezbitera, i Towarzyszy, męczenników', 'czerwony', 'Rdz 41, 55-57; 42, 5-7a. 17-24a; Ps 33(32), 2-3. 10-11. 18-19; Mt 10, 1-7', '', 'optional_memorial'),
(102, '2025-07-10', 'Czwartek', 'Dzień powszedni', 'zielony', 'Rdz 44, 18-21. 23b-29; 45, 1-5; Ps 105(104), 16-17. 18-19. 20-21; Mt 10, 7-15', '', 'ferial'),
(103, '2025-07-11', 'Piątek', 'Święto św. Benedykta, opata, patrona Europy', 'biały', 'Prz 2, 1-9; Ps 34(33), 2-3. 4-5. 6-7. 8-9. 10-11; Mt 19, 27-29', 'Msza ze święta z „Chwała”; możliwość użycia tekstów o zakonnikach', 'feast'),
(104, '2025-07-12', 'Sobota', 'Wspomnienie św. Brunona Bonifacego z Kwerfurtu, biskupa i męczennika', 'czerwony', 'Rdz 49, 29-33; 50, 15-26; Ps 105(104), 1-2. 3-4. 6-7; Mt 10, 24-33', '', 'memorial'),
(105, '2025-07-13', 'Niedziela', '15. Niedziela zwykła', 'zielony', 'Am 7, 12-15; Ps 85(84), 9-10. 11-12. 13-14; Ef 1, 3-14; Mk 6, 7-13', 'W niektórych diecezjach wspomnienie bł. Andrzeja Świerada i Benedykta – w poniedziałek', 'ferial'),
(106, '2025-07-14', 'Poniedziałek', 'Dzień powszedni', 'zielony', 'Wj 1, 8-14. 22; Ps 124(123), 1-3. 4-6. 7-8; Mt 10, 34 – 11, 1', '', 'ferial'),
(107, '2025-07-14', 'Poniedziałek', 'Wspomnienie dowolne św. Kamila de Lellis, prezbitera', 'biały', 'Wj 1, 8-14. 22; Ps 124(123), 1-3. 4-6. 7-8; Mt 10, 34 – 11, 1', '', 'optional_memorial'),
(108, '2025-07-14', 'Poniedziałek', 'Wspomnienie dowolne św. Henryka', 'biały', 'Wj 1, 8-14. 22; Ps 124(123), 1-3. 4-6. 7-8; Mt 10, 34 – 11, 1', '', 'optional_memorial'),
(109, '2025-07-15', 'Wtorek', 'Wspomnienie św. Bonawentury, biskupa i doktora Kościoła', 'biały', 'Wj 2, 1-15a; Ps 69(68), 3. 14. 30-31. 33-34; Mt 11, 20-24', '', 'memorial'),
(110, '2025-07-16', 'Środa', 'Wspomnienie dowolne Najświętszej Maryi Panny z Góry Karmel', 'biały', 'Wj 3, 1-6. 9-12; Ps 103(102), 1-2. 3-4. 6-7; Mt 11, 25-27', 'Rocznica nominacji bp. Damiana Muskusa (2011)', 'memorial'),
(111, '2025-07-17', 'Czwartek', 'Dzień powszedni', 'zielony', 'Wj 3, 13-20; Ps 105(104), 1 i 5. 8-9. 24-25. 26-27; Mt 11, 28-30', '', 'ferial'),
(112, '2025-07-18', 'Piątek', 'Wspomnienie dowolne św. Szymona z Lipnicy, prezbitera', 'biały', 'Wj 11, 10 – 12, 14; Ps 116B(115), 12-13. 15 i 16bc. 17-18; Mt 12, 1-8', '', 'memorial'),
(113, '2025-07-19', 'Sobota', 'Dzień powszedni', 'zielony', 'Wj 12, 37-42; Ps 136(135), 1 i 23-24. 10-12. 13-15; Mt 12, 14-21', '', 'ferial'),
(114, '2025-07-19', 'Sobota', 'Msza o Najświętszej Maryi Pannie w sobotę', 'biały', 'Wj 12, 37-42; Ps 136(135), 1 i 23-24. 10-12. 13-15; Mt 12, 14-21', 'Nieszpory z 16. niedzieli zwykłej; Psalterz IV tyg.', 'optional_memorial'),
(115, '2025-07-20', 'Niedziela', '16. Niedziela zwykła', 'zielony', 'Mdr 12, 13. 16-19; Ps 86(85), 5-6. 9-10. 15-16; Rz 8, 26-27; Mt 13, 24-43', 'Możliwe wspomnienie bł. Czesława, prezbitera', 'ferial'),
(116, '2025-07-21', 'Poniedziałek', 'Dzień powszedni', 'zielony', 'Wj 14, 5-9a. 10-18; Wj 15, 1b-2. 3-4. 5-6; Mt 12, 38-42', '', 'ferial'),
(117, '2025-07-21', 'Poniedziałek', 'Wspomnienie dowolne św. Wawrzyńca z Brindisi, prezbitera i doktora Kościoła', 'biały', 'Wj 14, 5-9a. 10-18; Wj 15, 1b-2. 3-4. 5-6; Mt 12, 38-42', '', 'optional_memorial'),
(118, '2025-07-21', 'Poniedziałek', 'Wspomnienie dowolne św. Apolinarego, biskupa i męczennika', 'czerwony', 'Wj 14, 5-9a. 10-18; Wj 15, 1b-2. 3-4. 5-6; Mt 12, 38-42', '', 'optional_memorial'),
(119, '2025-07-22', 'Wtorek', 'Święto św. Marii Magdaleny', 'biały', 'PnP 8, 6-7 lub 2 Kor 5, 14-17; Ps 63(62), 2. 3-4. 5-6. 8-9; J 20, 1. 11-18', 'Msza własna z „Chwała”; modlitwy i teksty ze święta', 'feast'),
(120, '2025-07-23', 'Środa', 'Święto św. Brygidy, zakonnicy, patronki Europy', 'biały', 'Ga 2, 19-20; Ps 34(33), 2-3. 4-5. 6-7. 8-9; J 15, 1-8', 'Msza własna z „Chwała” i modlitwami ze święta', 'feast'),
(121, '2025-07-24', 'Czwartek', 'Wspomnienie św. Kingi, dziewicy', 'biały', 'Wj 19, 1-2. 9-11. 16-20b; Dn 3, 52-56; Mt 13, 10-17', 'Urodziny abpa Marka Jędraszewskiego (1949)', 'memorial'),
(122, '2025-07-25', 'Piątek', 'Święto św. Jakuba, apostoła', 'czerwony', '2 Kor 4, 7-15; Ps 126(125), 1-2ab. 2cd-3. 4-5. 6; Mt 20, 20-28', 'Msza własna; błogosławieństwo pojazdów – św. Krzysztofa (opcjonalnie)', 'feast'),
(123, '2025-07-26', 'Sobota', 'Wspomnienie świętych Joachima i Anny, rodziców NMP', 'biały', 'Syr 44, 1. 10-15; Ps 132(131), 11. 13-14. 17-18; Mt 13, 24-30', '', 'memorial'),
(124, '2025-07-27', 'Niedziela', '17. Niedziela zwykła', 'zielony', '1 Krl 3, 5. 7-12; Ps 119(118), 57 i 72. 76-77. 127-128. 129-130; Rz 8, 28-30; Mt 13, 44-52', 'III Pielgrzymka Seniorów do Sanktuarium Bożego Miłosierdzia – godz. 12.00', 'ferial'),
(125, '2025-07-28', 'Poniedziałek', 'Dzień powszedni', 'zielony', 'Wj 32, 15-24. 30-34; Ps 106(105), 19-20. 21-22. 23; Mt 13, 31-35', '', 'ferial'),
(126, '2025-07-28', 'Poniedziałek', 'Wspomnienie dowolne św. Szarbela Makhlufa, prezbitera', 'biały', 'Wj 32, 15-24. 30-34; Ps 106(105), 19-20. 21-22. 23; Mt 13, 31-35', '', 'optional_memorial'),
(127, '2025-07-29', 'Wtorek', 'Wspomnienie św. Marty, Marii i Łazarza', 'biały', '1 J 4, 7-16; Ps 34(33), 2-3. 4-5. 6-7. 8-9. 10-11; J 11, 19-27 lub Łk 10, 38-42', '', 'memorial'),
(128, '2025-07-30', 'Środa', 'Dzień powszedni', 'zielony', 'Wj 34, 29-35; Ps 99(98), 5. 6. 7. 9; Mt 13, 44-46', '', 'ferial'),
(129, '2025-07-30', 'Środa', 'Wspomnienie dowolne św. Piotra Chryzologa, biskupa i doktora Kościoła', 'biały', 'Wj 34, 29-35; Ps 99(98), 5. 6. 7. 9; Mt 13, 44-46', '', 'optional_memorial'),
(130, '2025-07-31', 'Czwartek', 'Wspomnienie św. Ignacego z Loyoli, prezbitera', 'biały', 'Wj 40, 16-21. 34-38; Ps 84(83), 3. 4. 5-6a i 8a. 11; Mt 13, 47-53', '', 'memorial'),
(131, '2025-08-01', 'Piątek', 'Wspomnienie św. Alfonsa Marii Liguoriego, biskupa i doktora Kościoła', 'biały', 'Kpł 23, 1. 4-11. 15-16. 27. 34b-37; Ps 81(80), 3-4. 5-6b. 10-11ab; Mt 13, 54-58', 'Pierwszy piątek – wotywa o NSPJ; rocznica wybuchu powstania warszawskiego (1944)', 'memorial'),
(132, '2025-08-02', 'Sobota', 'Dzień powszedni', 'zielony', 'Kpł 25, 1. 8-17; Ps 67(66), 2-3. 5. 7-8; Mt 14, 1-12', 'Pierwsza sobota; możliwość uzyskania odpustu „Porcjunkuli”', 'ferial'),
(133, '2025-08-02', 'Sobota', 'Wspomnienie dowolne św. Euzebiusza z Vercelli, biskupa', 'biały', 'Kpł 25, 1. 8-17; Ps 67(66), 2-3. 5. 7-8; Mt 14, 1-12', '', 'optional_memorial'),
(134, '2025-08-02', 'Sobota', 'Wspomnienie dowolne św. Piotra Juliana Eymarda, prezbitera', 'biały', 'Kpł 25, 1. 8-17; Ps 67(66), 2-3. 5. 7-8; Mt 14, 1-12', '', 'optional_memorial'),
(135, '2025-08-03', 'Niedziela', '18. Niedziela zwykła', 'zielony', 'Koh 1, 2; 2, 21-23; Ps 90(89), 3-4. 5-6. 12-13. 14 i 17; Kol 3, 1-5. 9-11; Łk 12, 13-21', 'Pierwsza niedziela: adoracja Najświętszego Sakramentu – PSB, s. 17.', 'ferial'),
(136, '2025-08-04', 'Poniedziałek', 'Wspomnienie św. Jana Marii Vianneya, prezbitera', 'biały', 'Lb 11, 4b-15; Ps 81(80), 11-12. 13-14. 15-16; Mt 14, 13-21', '', 'memorial'),
(137, '2025-08-05', 'Wtorek', 'Dzień powszedni', 'zielony', 'Lb 12, 1-13; Ps 51(50), 3-4. 5-6b. 6c-7. 12-13; Mt 14, 22-36', '', 'ferial'),
(138, '2025-08-05', 'Wtorek', 'Rocznica poświęcenia rzymskiej bazyliki Najświętszej Maryi Panny', 'biały', 'Lb 12, 1-13; Ps 51(50), 3-4. 5-6b. 6c-7. 12-13; Mt 14, 22-36', '', 'optional_memorial'),
(139, '2025-08-06', 'Środa', 'Święto Przemienienia Pańskiego', 'biały', 'Dn 7, 9-10. 13-14; Ps 97(96), 1-2. 5-6. 9; 2 P 1, 16-19; Mk 9, 2-10', 'Rozpoczęcie Pieszej Pielgrzymki Krakowskiej na Jasną Górę – Wawel, godz. 7.00', 'feast'),
(140, '2025-08-07', 'Czwartek', 'Dzień powszedni', 'zielony', 'Pwt 4, 32-40; Ps 77(76), 12-13. 14-15. 16 i 21; Mt 16, 24-28', 'Pierwszy czwartek: wotywa o kapłanach', 'ferial'),
(141, '2025-08-07', 'Czwartek', 'Wspomnienie dowolne świętych męczenników Sykstusa II, papieża, i Towarzyszy', 'czerwony', 'Pwt 4, 32-40; Ps 77(76), 12-13. 14-15. 16 i 21; Mt 16, 24-28', '', 'optional_memorial'),
(142, '2025-08-07', 'Czwartek', 'Wspomnienie dowolne św. Kajetana, prezbitera', 'biały', 'Pwt 4, 32-40; Ps 77(76), 12-13. 14-15. 16 i 21; Mt 16, 24-28', '', 'optional_memorial'),
(143, '2025-08-08', 'Piątek', 'Wspomnienie św. Dominika, prezbitera', 'biały', 'Pwt 6, 4-13; Ps 18(17), 2-3a. 3bc-4. 47 i 51ab; Mt 17, 14-20', '', 'memorial'),
(144, '2025-08-09', 'Sobota', 'Święto św. Teresy Benedykty od Krzyża (Edyty Stein), dziewicy i męczennicy, patronki Europy', 'czerwony', 'Oz 2, 16b. 17b. 21-22; Ps 45(44), 11-12. 14-15. 16-17; Mt 25, 1-13', '', 'feast'),
(145, '2025-08-10', 'Niedziela', '19. Niedziela zwykła', 'zielony', '1 Krl 19, 9a. 11-13a; Ps 85(84), 9-10. 11-12. 13-14; Rz 9, 1-5; Mt 14, 22-33', 'Dziś przypada święto św. Wawrzyńca, diakona i męczennika.', 'ferial'),
(146, '2025-08-11', 'Poniedziałek', 'Wspomnienie św. Klary, dziewicy', 'biały', 'Pwt 10, 12-22; Ps 147B(147), 12-13. 14-15. 19-20; Mt 17, 22-27', '', 'memorial'),
(147, '2025-08-12', 'Wtorek', 'Dzień powszedni', 'zielony', 'Pwt 31, 1-8; Pwt 32, 3-4ab. 7. 8-9. 12; Mt 18, 1-5. 10. 12-14', '', 'ferial'),
(148, '2025-08-12', 'Wtorek', 'Wspomnienie dowolne św. Joanny Franciszki de Chantal, zakonnicy', 'biały', 'Pwt 31, 1-8; Pwt 32, 3-4ab. 7. 8-9. 12; Mt 18, 1-5. 10. 12-14', '', 'optional_memorial'),
(149, '2025-08-12', 'Wtorek', 'Wspomnienie dowolne świętych męczenników Poncjana, papieża, i Hipolita, prezbitera', 'czerwony', 'Pwt 31, 1-8; Pwt 32, 3-4ab. 7. 8-9. 12; Mt 18, 1-5. 10. 12-14', '', 'optional_memorial'),
(150, '2025-08-13', 'Środa', 'Święto Najświętszej Maryi Panny Kalwaryjskiej', 'biały', 'Iz 61, 9-11; 1 Sm 2, 1. 4-5. 6-7. 8abcd; J 2, 1-11', '', 'feast'),
(151, '2025-08-14', 'Czwartek', 'Wspomnienie św. Maksymiliana Marii Kolbego, prezbitera i męczennika', 'czerwony', 'Ez 12, 1-12; Ps 78(77), 56-57. 58-59. 61-62; Mt 18, 21 – 19, 1', 'Rocznica nominacji bp. Jana Zająca (2004). Wieczorna Msza z Uroczystości Wniebowzięcia NMP.', 'memorial'),
(152, '2025-08-15', 'Piątek', 'Uroczystość Wniebowzięcia Najświętszej Maryi Panny', 'biały', 'Ap 11, 19a; 12, 1. 3-6a. 10ab; Ps 45(44), 7. 10bc. 11-12. 14-15; 1 Kor 15, 20-26; Łk 1, 39-56', 'Można pobłogosławić zioła i kwiaty. Uroczystości odpustowe i patriotyczne. Święto obowiązkowe.', 'solemnity'),
(153, '2025-08-16', 'Sobota', 'Dzień powszedni', 'zielony', 'Joz 24, 14-29; Ps 16(15), 1-2a. 5. 7-8. 11; Mt 19, 13-15', 'Dziś w Zatorze uroczystość św. Rocha. XXI Pielgrzymka Czicieli Bożego Miłosierdzia – 12:00', 'ferial'),
(154, '2025-08-16', 'Sobota', 'Wspomnienie dowolne św. Stefana Węgierskiego, króla', 'biały', 'Joz 24, 14-29; Ps 16(15), 1-2a. 5. 7-8. 11; Mt 19, 13-15', '', 'optional_memorial'),
(155, '2025-08-17', 'Niedziela', '20. Niedziela zwykła', 'zielony', 'Iz 56, 1. 6-7; Ps 67(66), 2-3. 5. 6 i 8; Rz 11, 13-15. 29-32; Mt 15, 21-28', 'Dziś przypada święto św. Jacka, prezbitera, patrona Archidiecezji Krakowskiej.', 'ferial'),
(156, '2025-08-18', 'Poniedziałek', 'Dzień powszedni', 'zielony', 'Sdz 2, 11-19; Ps 106(105), 34-35. 36-37. 39-40. 43ab-44; Mt 19, 16-22', '', 'ferial'),
(157, '2025-08-19', 'Wtorek', 'Dzień powszedni', 'zielony', 'Sdz 6, 11-24a; Ps 85(84), 9. 11-12. 13-14; Mt 19, 23-30', '', 'ferial'),
(158, '2025-08-19', 'Wtorek', 'Wspomnienie dowolne św. Jana Eudesa, prezbitera', 'biały', 'Sdz 6, 11-24a; Ps 85(84), 9. 11-12. 13-14; Mt 19, 23-30', '', 'optional_memorial'),
(159, '2025-08-20', 'Środa', 'Wspomnienie św. Bernarda, opata i doktora Kościoła', 'biały', 'Sdz 9, 6-15; Ps 21(20), 2-3. 4-5. 6-7; Mt 20, 1-16', '', 'memorial'),
(160, '2025-08-21', 'Czwartek', 'Wspomnienie św. Piusa X, papieża', 'biały', 'Sdz 11, 29-39a; Ps 40(39), 5. 7-8a. 8b-9. 10; Mt 22, 1-14', 'Dziś bierzmowanie dorosłych w bazylice Mariackiej o 17:00.', 'memorial'),
(161, '2025-08-22', 'Piątek', 'Wspomnienie Najświętszej Maryi Panny Królowej', 'biały', 'Rt 1, 1. 3-6. 14b-16. 22; Ps 146(145), 5-6. 7. 8-9a. 9bc-10; Mt 22, 34-40', '', 'memorial'),
(162, '2025-08-23', 'Sobota', 'Dzień powszedni', 'zielony', 'Rt 2, 1-3. 8-11; 4, 13-17; Ps 128(127), 1-2. 3. 4-5; Mt 23, 1-12', '', 'ferial'),
(163, '2025-08-23', 'Sobota', 'Wspomnienie dowolne św. Róży z Limy, dziewicy', 'biały', 'Rt 2, 1-3. 8-11; 4, 13-17; Ps 128(127), 1-2. 3. 4-5; Mt 23, 1-12', '', 'optional_memorial');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `device_tokens`
--

CREATE TABLE `device_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `card_id` varchar(20) NOT NULL,
  `device_token` text NOT NULL,
  `platform` text DEFAULT NULL,
  `app_version` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `email_verification_codes`
--

CREATE TABLE `email_verification_codes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `verification_code` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email_verification_codes`
--

INSERT INTO `email_verification_codes` (`id`, `user_id`, `verification_code`, `expires_at`, `used`) VALUES
(4, 3, '487826', '2025-05-26 15:05:41', 1),
(5, 5, '515905', '2025-05-28 15:26:15', 1),
(6, 3, '260617', '2025-05-28 15:35:39', 1),
(7, 11, '969398', '2025-06-05 15:56:03', 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `hidden_messages`
--

CREATE TABLE `hidden_messages` (
  `id` int(11) NOT NULL,
  `card_id` bigint(20) NOT NULL,
  `message_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `justifications`
--

CREATE TABLE `justifications` (
  `id` int(11) NOT NULL,
  `reading_id` int(11) NOT NULL,
  `card_id` varchar(30) NOT NULL,
  `message` text NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp(),
  `reviewed_at` datetime DEFAULT NULL,
  `reviewed_by` varchar(50) DEFAULT NULL,
  `hidden_for_user` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `justifications`
--

INSERT INTO `justifications` (`id`, `reading_id`, `card_id`, `message`, `status`, `created_at`, `reviewed_at`, `reviewed_by`, `hidden_for_user`) VALUES
(4, 156, '1050529798272', 'Byłem chory', 'pending', '2025-06-03 15:59:41', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `mass_times`
--

CREATE TABLE `mass_times` (
  `id` int(11) NOT NULL,
  `id_parish` varchar(10) NOT NULL,
  `day_of_week` enum('Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota') NOT NULL,
  `time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mass_times`
--

INSERT INTO `mass_times` (`id`, `id_parish`, `day_of_week`, `time`) VALUES
(1, 'PRM001', 'Niedziela', '06:30:00'),
(2, 'PRM001', 'Niedziela', '08:00:00'),
(3, 'PRM001', 'Niedziela', '09:30:00'),
(4, 'PRM001', 'Niedziela', '11:00:00'),
(5, 'PRM001', 'Niedziela', '14:00:00'),
(6, 'PRM001', 'Niedziela', '17:00:00'),
(7, 'PRM001', 'Poniedziałek', '06:30:00'),
(8, 'PRM001', 'Poniedziałek', '07:00:00'),
(9, 'PRM001', 'Poniedziałek', '08:00:00'),
(10, 'PRM001', 'Poniedziałek', '18:00:00'),
(11, 'PRM001', 'Wtorek', '06:30:00'),
(12, 'PRM001', 'Wtorek', '07:00:00'),
(13, 'PRM001', 'Wtorek', '08:00:00'),
(14, 'PRM001', 'Wtorek', '18:00:00'),
(15, 'PRM001', 'Środa', '06:30:00'),
(16, 'PRM001', 'Środa', '07:00:00'),
(17, 'PRM001', 'Środa', '08:00:00'),
(18, 'PRM001', 'Środa', '18:00:00'),
(19, 'PRM001', 'Czwartek', '06:30:00'),
(20, 'PRM001', 'Czwartek', '07:00:00'),
(21, 'PRM001', 'Czwartek', '08:00:00'),
(22, 'PRM001', 'Czwartek', '18:00:00'),
(23, 'PRM001', 'Piątek', '06:30:00'),
(24, 'PRM001', 'Piątek', '07:00:00'),
(25, 'PRM001', 'Piątek', '08:00:00'),
(26, 'PRM001', 'Piątek', '18:00:00'),
(27, 'PRM001', 'Sobota', '06:30:00'),
(28, 'PRM001', 'Sobota', '07:00:00'),
(29, 'PRM001', 'Sobota', '08:00:00'),
(30, 'PRM001', 'Sobota', '18:00:00');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` varchar(30) NOT NULL,
  `recipient_id` varchar(30) DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `body` text NOT NULL,
  `is_reply` tinyint(1) DEFAULT 0,
  `reply_to` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `hidden_for_user` tinyint(1) DEFAULT 0,
  `hidden_for_moderator` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `recipient_id`, `subject`, `body`, `is_reply`, `reply_to`, `created_at`, `hidden_for_user`, `hidden_for_moderator`) VALUES
(5, '1050529798272', 'MODERATOR', 'Prośba o wolne', 'Czy mogę być zwolniony w najbliższą sobotę?', 0, NULL, '2025-06-03 15:58:38', 0, 0),
(6, 'MODERATOR', '1050529798272', 'Przypomnienie o zbiórce', 'Zbiórka w sobotę o 17:00, obecność obowiązkowa.', 0, NULL, '2025-06-03 15:58:55', 0, 0),
(7, 'MODERATOR', NULL, 'Zmiana godzin służby', 'Od przyszłego tygodnia poranna służba rozpoczyna się o 7:30.', 0, NULL, '2025-06-03 15:59:02', 0, 0),
(8, 'MODERATOR', '1050529798272', 'Re: Prośba o wolne', 'Zwolnienie zostało zaakceptowane.', 1, 5, '2025-06-03 15:59:21', 0, 0),
(9, '1050529798272', 'MODERATOR', 'Nie będzie mnie', 'dsjdbsaujdbausdusabdasidvasuydfasytdytausgdasdhasda', 0, NULL, '2025-06-03 20:25:16', 0, 0),
(10, '292340078623', 'MODERATOR', 'Marek Nowak', 'Co ja tu robię', 0, NULL, '2025-06-03 20:28:00', 0, 0);

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
-- Struktura tabeli dla tabeli `PRM001_04_2025`
--

CREATE TABLE `PRM001_04_2025` (
  `card_id` varchar(20) NOT NULL,
  `points` int(11) DEFAULT 0,
  `points_meating` int(11) DEFAULT 0,
  `sum` int(11) GENERATED ALWAYS AS (`points` + `points_meating`) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `PRM001_04_2025`
--

INSERT INTO `PRM001_04_2025` (`card_id`, `points`, `points_meating`) VALUES
('1050529798272', 10, 0),
('293649553506', 10, 0),
('379492996124', 5, 0),
('430912739534', 25, 0),
('847578180774', 15, 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `PRM001_06_2025`
--

CREATE TABLE `PRM001_06_2025` (
  `card_id` varchar(20) NOT NULL,
  `points` int(11) DEFAULT 0,
  `points_meating` int(11) DEFAULT 0,
  `sum` int(11) GENERATED ALWAYS AS (`points` + `points_meating`) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `PRM001_06_2025`
--

INSERT INTO `PRM001_06_2025` (`card_id`, `points`, `points_meating`) VALUES
('1050177083521', 35, 35),
('1050529798272', 230, 30),
('158653716531', 45, 35),
('292340078623', 0, -10),
('293649553506', 45, 30),
('379492996124', 10, 10),
('388204172907', 55, 27),
('430912739534', 45, 10),
('847578180774', 70, 30),
('88040314991', 50, 50);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `PRM001_2025`
--

CREATE TABLE `PRM001_2025` (
  `card_id` varchar(20) NOT NULL,
  `points` int(11) DEFAULT 0,
  `points_meating` int(11) DEFAULT 0,
  `sum` int(11) GENERATED ALWAYS AS (`points` + `points_meating`) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `PRM001_2025`
--

INSERT INTO `PRM001_2025` (`card_id`, `points`, `points_meating`) VALUES
('1050177083521', 45, 45),
('1050529798272', 232, 30),
('158653716531', 50, 40),
('292340078623', 53, 8),
('293649553506', 55, 35),
('379492996124', 0, 0),
('388204172907', 65, 27),
('430912739534', 35, -10),
('847578180774', 35, 0),
('88040314991', 55, 50);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `PRM001_readings`
--

CREATE TABLE `PRM001_readings` (
  `id` int(11) NOT NULL,
  `card_id` varchar(20) NOT NULL,
  `date_read` date NOT NULL,
  `time_read` time NOT NULL,
  `name_service` varchar(255) NOT NULL,
  `time_service` time NOT NULL,
  `points` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `PRM001_readings`
--

INSERT INTO `PRM001_readings` (`id`, `card_id`, `date_read`, `time_read`, `name_service`, `time_service`, `points`) VALUES
(144, '1050529798272', '2025-05-20', '08:00:00', 'Msza Święta w dni powszednie', '08:00:00', 5),
(145, '1050529798272', '2025-05-22', '18:00:00', 'Nabożeństwo ku czci św. Rity', '18:00:00', 10),
(146, '1050529798272', '2025-05-23', '18:00:00', 'Nabożeństwo Majowe', '18:00:00', 10),
(147, '1050529798272', '2025-05-25', '17:00:00', 'Msza Święta Niedzielna', '17:00:00', 5),
(148, '1050529798272', '2025-05-29', '17:00:00', 'Inne nabożeństwo', '17:00:00', 5),
(149, '1050529798272', '2025-05-29', '17:50:00', 'Nabożeństwo Majowe', '18:00:00', 10),
(150, '1050529798272', '2025-05-30', '17:50:00', 'Nabożeństwo Majowe', '18:00:00', 10),
(151, '1050529798272', '2025-05-31', '17:50:00', 'Nabożeństwo Majowe', '18:00:00', 10),
(152, '1050529798272', '2025-06-01', '17:10:00', 'Msza Święta Niedzielna', '17:00:00', 5),
(153, '1050529798272', '2025-05-21', '10:00:00', 'Brak służby w tygodniu', '08:00:00', -10),
(154, '1050529798272', '2025-05-23', '10:00:00', 'Brak służby w tygodniu', '18:00:00', -10),
(155, '1050529798272', '2025-05-25', '17:00:00', 'Brak służby w niedzielę', '17:00:00', -15),
(156, '1050529798272', '2025-05-30', '18:30:00', 'Brak służby w tygodniu', '18:00:00', -40),
(157, '292340078623', '2025-06-11', '12:24:00', 'Inne nabożeństwo', '12:24:00', 5),
(158, '1050529798272', '2025-06-11', '12:24:00', 'Inne nabożeństwo', '12:24:00', 5),
(159, '430912739534', '2025-06-11', '12:24:00', 'Inne nabożeństwo', '12:24:00', 5),
(160, '1050177083521', '2025-06-11', '12:24:00', 'Inne nabożeństwo', '12:24:00', 5),
(161, '88040314991', '2025-06-11', '12:24:00', 'Inne nabożeństwo', '12:24:00', 5),
(162, '388204172907', '2025-06-11', '12:24:00', 'Inne nabożeństwo', '12:24:00', 5),
(163, '379492996124', '2025-06-11', '12:24:00', 'Inne nabożeństwo', '12:24:00', 5),
(164, '293649553506', '2025-06-11', '12:24:00', 'Inne nabożeństwo', '12:24:00', 5),
(165, '158653716531', '2025-06-11', '12:24:00', 'Inne nabożeństwo', '12:24:00', 5),
(166, '847578180774', '2025-06-11', '12:24:00', 'Inne nabożeństwo', '12:24:00', 5),
(197, '1050177083521', '2025-06-12', '16:52:35', 'Zbiórka', '16:52:35', 10),
(198, '1050529798272', '2025-06-12', '16:52:35', 'Zbiórka', '16:52:35', 10),
(199, '158653716531', '2025-06-12', '16:52:35', 'Zbiórka', '16:52:35', 10),
(200, '292340078623', '2025-06-12', '16:52:35', 'Zbiórka', '16:52:35', -10),
(201, '293649553506', '2025-06-12', '16:52:35', 'Zbiórka', '16:52:35', 10),
(202, '379492996124', '2025-06-12', '16:52:35', 'Zbiórka', '16:52:35', 10),
(203, '388204172907', '2025-06-12', '16:52:35', 'Zbiórka', '16:52:35', 0),
(204, '430912739534', '2025-06-12', '16:52:35', 'Zbiórka', '16:52:35', -10),
(205, '847578180774', '2025-06-12', '16:52:35', 'Zbiórka', '16:52:35', 0),
(206, '88040314991', '2025-06-12', '16:52:35', 'Zbiórka', '16:52:35', 10);

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
-- Struktura tabeli dla tabeli `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `card_id` varchar(20) DEFAULT NULL,
  `token` text NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `appType` varchar(20) NOT NULL,
  `user_agent` text DEFAULT NULL,
  `ip_address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `card_id`, `token`, `expires_at`, `created_at`, `appType`, `user_agent`, `ip_address`) VALUES
(43, '88040314991', 'b57a3afa8110dd149597a9850b7f55112512794b9247463acf751b90142b4748', '2025-07-16 12:34:00', '2025-07-02 12:34:00', 'mobile', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `schedules`
--

CREATE TABLE `schedules` (
  `id` int(11) NOT NULL,
  `date_from` date NOT NULL,
  `date_to` date NOT NULL,
  `day_of_week` enum('Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota','Niedziela') NOT NULL,
  `time` time NOT NULL,
  `card_id` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` (`id`, `date_from`, `date_to`, `day_of_week`, `time`, `card_id`) VALUES
(36, '2025-06-13', '2025-07-01', 'Poniedziałek', '06:30:00', '388204172907'),
(37, '2025-06-13', '2025-07-01', 'Poniedziałek', '06:30:00', '1050529798272'),
(38, '2025-06-13', '2025-07-01', 'Poniedziałek', '06:30:00', '1050177083521'),
(39, '2025-06-13', '2025-07-01', 'Wtorek', '18:00:00', '430912739534');

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
-- Indeksy dla tabeli `about_app`
--
ALTER TABLE `about_app`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `auth`
--
ALTER TABLE `auth`
  ADD PRIMARY KEY (`id_auth`),
  ADD UNIQUE KEY `login` (`login`),
  ADD KEY `card_id` (`card_id`);

--
-- Indeksy dla tabeli `calendar_tools`
--
ALTER TABLE `calendar_tools`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `device_tokens`
--
ALTER TABLE `device_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_card` (`card_id`);

--
-- Indeksy dla tabeli `email_verification_codes`
--
ALTER TABLE `email_verification_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeksy dla tabeli `hidden_messages`
--
ALTER TABLE `hidden_messages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `card_id` (`card_id`,`message_id`);

--
-- Indeksy dla tabeli `justifications`
--
ALTER TABLE `justifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reading_id` (`reading_id`);

--
-- Indeksy dla tabeli `mass_times`
--
ALTER TABLE `mass_times`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `parishes`
--
ALTER TABLE `parishes`
  ADD PRIMARY KEY (`id_parish`);

--
-- Indeksy dla tabeli `PRM001_04_2025`
--
ALTER TABLE `PRM001_04_2025`
  ADD PRIMARY KEY (`card_id`);

--
-- Indeksy dla tabeli `PRM001_06_2025`
--
ALTER TABLE `PRM001_06_2025`
  ADD PRIMARY KEY (`card_id`);

--
-- Indeksy dla tabeli `PRM001_2025`
--
ALTER TABLE `PRM001_2025`
  ADD PRIMARY KEY (`card_id`);

--
-- Indeksy dla tabeli `PRM001_readings`
--
ALTER TABLE `PRM001_readings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `card_id` (`card_id`);

--
-- Indeksy dla tabeli `PRM001_services`
--
ALTER TABLE `PRM001_services`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `schedules`
--
ALTER TABLE `schedules`
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
-- AUTO_INCREMENT for table `about_app`
--
ALTER TABLE `about_app`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `auth`
--
ALTER TABLE `auth`
  MODIFY `id_auth` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `calendar_tools`
--
ALTER TABLE `calendar_tools`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=164;

--
-- AUTO_INCREMENT for table `device_tokens`
--
ALTER TABLE `device_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_verification_codes`
--
ALTER TABLE `email_verification_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `hidden_messages`
--
ALTER TABLE `hidden_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `justifications`
--
ALTER TABLE `justifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `mass_times`
--
ALTER TABLE `mass_times`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `PRM001_readings`
--
ALTER TABLE `PRM001_readings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=207;

--
-- AUTO_INCREMENT for table `PRM001_services`
--
ALTER TABLE `PRM001_services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth`
--
ALTER TABLE `auth`
  ADD CONSTRAINT `auth_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `users` (`card_id`) ON DELETE CASCADE;

--
-- Constraints for table `device_tokens`
--
ALTER TABLE `device_tokens`
  ADD CONSTRAINT `fk_user_card` FOREIGN KEY (`card_id`) REFERENCES `users` (`card_id`) ON DELETE CASCADE;

--
-- Constraints for table `email_verification_codes`
--
ALTER TABLE `email_verification_codes`
  ADD CONSTRAINT `email_verification_codes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `auth` (`id_auth`) ON DELETE CASCADE;

--
-- Constraints for table `justifications`
--
ALTER TABLE `justifications`
  ADD CONSTRAINT `justifications_ibfk_1` FOREIGN KEY (`reading_id`) REFERENCES `PRM001_readings` (`id`);

--
-- Constraints for table `PRM001_04_2025`
--
ALTER TABLE `PRM001_04_2025`
  ADD CONSTRAINT `prm001_04_2025_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `users` (`card_id`);

--
-- Constraints for table `PRM001_06_2025`
--
ALTER TABLE `PRM001_06_2025`
  ADD CONSTRAINT `prm001_06_2025_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `users` (`card_id`);

--
-- Constraints for table `PRM001_2025`
--
ALTER TABLE `PRM001_2025`
  ADD CONSTRAINT `prm001_2025_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `users` (`card_id`);

--
-- Constraints for table `PRM001_readings`
--
ALTER TABLE `PRM001_readings`
  ADD CONSTRAINT `prm001_readings_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `users` (`card_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_parish`) REFERENCES `parishes` (`id_parish`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

INSERT INTO quizzes (ID, title)
    VALUES(1, 'Addition 1'),
            (2, 'Subtraction 1'),
            (3, 'Multiplication 1'),
            (4, 'Division 1'),
            (5, 'Capitals 1'),
            (6, 'General Knowledge 1');

INSERT INTO quiz_questions (quizID, question, correct_answer, answer1, answer2, answer3, answer4)
    VALUES(1, 'What’s 16+14?', 30, 30, 20, 40, 28),
            (1, 'What’s 11+13?', 24, 17, 13, 24, 20),
            (1, 'What’s 9+9?', 18, 19, 17, 16, 18),
            (1, 'What’s 20+21?', 41, 31, 41, 51, 40),
            (1, 'What’s 10+9?', 19, 19, 20, 21, 22),

            (2, 'What’s 16-11?', 5, 6, 4, 7, 5),
            (2, 'What’s 20-14?', 6, 5, 7, 6, 4),
            (2, 'What’s 21-10?', 11, 10, 11, 8, 5),
            (2, 'What’s 25-15?', 10, 10, 15, 5, 20),
            (2, 'What’s 30-14?', 16, 14, 12, 16, 10),

            (3, 'What’s 5x5?', 25, 15, 20, 30, 25),
            (3, 'What’s 4x4?', 16, 14, 18, 16, 20),
            (3, 'What’s 7x4?', 28, 21, 35, 25, 28),
            (3, 'What’s 3x6?', 18, 12, 18, 24, 15),
            (3, 'What’s 9x10?', 90, 90, 100, 9, 99),

            (4, 'What’s 25/5?', 5, 10, 5, 8, 15),
            (4, 'What’s 16/4?', 4, 6, 4, 8, 7),
            (4, 'What’s 50/10?', 5, 5, 10, 4, 9),
            (4, 'What’s 27/9?', 3, 5, 4, 6, 3),
            (4, 'What’s 55/5?', 11, 10, 11, 12, 8),

            (5, 'What’s the capital of Schweiz?', 'Bern', 'Zurich', 'Bern', 'Davos', 'Zermatt'),
            (5, 'What’s the capital of Finland?', 'Helsinki', 'Tampere', 'Oulu', 'Lahti', 'Helsinki'),
            (5, 'What’s the capital of Argentina?', 'Buenos Aires', 'Buenos Aires', 'Cordoba', 'Merlo', 'Vicente Lopez'),
            (5, 'What’s the capital of Thailand?', 'Bangkok', 'Phuket', 'Pattaya', 'Bangkok', 'Rayong'),
            (5, 'What’s the capital of Ukraine?', 'Kyiv', 'Odes', 'Kyiv', 'Donetsk', 'Lviv'),

            (6, 'What’s the biggest country in the world?', 'Russia', 'USA', 'China', 'Canada', 'Russia'),
            (6, 'What’s the smallest country in the world?', 'Vatican City', 'Monaco', 'Vatican City', 'Liechtenstein', 'Maldives'),
            (6, 'What’s the biggest country in South America?', 'Brazil', 'Argentina', 'Peru', 'Colombia', 'Brazil'),
            (6, 'What’s the capital of Australia?', 'Canberra', 'Canberra', 'Sydney', 'Perth', 'Melbourne'),
            (6, 'What’s the third most populated city in Sweden?', 'Malmö', 'Göteborg', 'Malmö', 'Stockholm', 'Uppsala');


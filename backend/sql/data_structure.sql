CREATE TABLE users
(
    ID       INTEGER PRIMARY KEY,
    username VARCHAR UNIQUE,
    password VARCHAR,
    name     VARCHAR,
    email    VARCHAR UNIQUE,
    role     varchar DEFAULT 'student'
);

CREATE TABLE quiz_categories
(
    ID           INTEGER PRIMARY KEY,
    categoryName VARCHAR NOT NULL
);

CREATE TABLE quizzes
(
    ID         INTEGER PRIMARY KEY,
    title      VARCHAR NOT NULL,
    categoryID INTEGER,
    FOREIGN KEY (categoryID) REFERENCES quiz_categories (ID)
);

CREATE TABLE quiz_questions
(
    ID             INTEGER PRIMARY KEY,
    quizID         INTEGER,
    question       VARCHAR,
    correct_answer VARCHAR,
    answer1        VARCHAR,
    answer2        VARCHAR,
    answer3        VARCHAR,
    FOREIGN KEY (quizID) REFERENCES quizzes (ID)
);

CREATE TABLE quiz_results
(
    ID     INTEGER PRIMARY KEY,
    userID INTEGER,
    quizID INTEGER,
    score  INTEGER,
    FOREIGN KEY (userID) REFERENCES users (ID)
);

CREATE TABLE failed_questions
(
    ID         INTEGER PRIMARY KEY,
    userID     INTEGER,
    questionID INTEGER,
    FOREIGN KEY (userID) REFERENCES users (ID),
    FOREIGN KEY (questionID) REFERENCES quiz_questions (ID)
);

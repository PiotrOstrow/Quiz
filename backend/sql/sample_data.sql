INSERT INTO users (username, password ,role)
    VALUES( 'username1', 'password1' , 1),
          ( 'username2', 'password2' , 2);

INSERT INTO quizzes (title)
    VALUES( 'Quiz1'),
          ( 'Quiz2');


INSERT INTO quiz_questions (quizID, question, correct_answer, answer1, answer2, answer3, answer4)
    VALUES( 1, '2 + 5 = ?', '7', '8', '5', '6', '7'),
          ( 1, '2 * 4 = ?', '8', '7', '8', '9', '4');



import React from 'react';

const ViewQuizz = ({ quizz }) => {
  return (
    <div className='viewQuestionheight'>
        <h2>Vue du QUIZZ </h2>
      <h2>Nom : {quizz.name}</h2>
      {quizz.Questions.map((question, index) => (
        <div key={question.id}>
          <div className='question'><h3>Question{index+1} : {question.name}</h3></div>
          <ul>
            {question.Answers.map((answer, index) => (
              <li key={answer.id}>
              <div className='answer'> <p>Response{index+1}:{answer.name} - {answer.valid ? 'Correct' : 'Incorrect'}</p></div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ViewQuizz;

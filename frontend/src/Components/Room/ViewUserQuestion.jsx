import React, { useEffect, useState } from 'react';
import { useSocketContext } from '../../context/SocketContext';

const ViewUserQuestion = ({nextQuestion, roomId, timerQuestion, quizzId} ) => {
  const { sendResponse } = useSocketContext();

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (timerQuestion === 0) {
        sendResponse(roomId, quizzId, nextQuestion.id, selectedAnswer);
    }
  }, [timerQuestion]);

  return (
    <div className="viewQuestionheightQuizz">
      <h2>Quizz</h2>
      Temps : {nextQuestion.time} secondes
      <div className='centreQuizz'>
        
        Question : <span className="font-semibold text-3xl mb-5">{nextQuestion.name}</span>
        <ul>
          {nextQuestion.Answers.map((answer, index) => (
            <li key={answer.id}>
              <label className='answerAlone'>
                <input
                  type="radio"
                  name="answer"
                  value={answer.id}
                  // checked={selectedAnswer === answer.id}
                  onChange={() => setSelectedAnswer(answer.id)}
                />
                {answer.name}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewUserQuestion;

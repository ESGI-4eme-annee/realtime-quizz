import React, { useEffect, useState } from 'react';
import { useSocketContext } from '../../context/SocketContext';
import Notification from "../Notification/Notification.jsx";

const ViewUserQuestion = ({nextQuestion, roomId, timerQuestion, quizzId} ) => {
  const { sendResponse,responseValid,responseCounts } = useSocketContext();

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  console.log();

  useEffect(() => {
    if (selectedAnswer !== null && responseValid == null) {
      sendResponse(roomId, quizzId, nextQuestion?.id, selectedAnswer, false);
    }  
  }, [selectedAnswer]);

  useEffect(() => {
    console.log("responseValid", responseValid);
    console.log();
    if (timerQuestion === 0) {
        sendResponse(roomId, quizzId, nextQuestion.id, selectedAnswer, true);
    }
  }, [timerQuestion]);

  return (
    <div className="viewQuestionheightQuizz">
      <h2>Quizz</h2>
      Temps : {nextQuestion.time} secondes
      <div className='centreQuizz card border w-2/3 bg-base-100 shadow-md rounded-2xl p-5'>
        
        Question : <span className="font-semibold text-3xl mb-5">{nextQuestion.name}</span>
        <ul>
          {nextQuestion.Answers.map((answer, index) => (
            <li key={answer.id} className={responseValid === answer.id ? "valid" : ""}>
              <label className='answerAlone'>
                <input
                  type="radio"
                  name="answer"
                  value={answer.id}
                  className="mx-3"
                  checked={selectedAnswer === answer.id}
                  onChange={() => setSelectedAnswer(answer.id)}
                />
               {answer.name}( {responseCounts[answer.id] || 0})
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewUserQuestion;

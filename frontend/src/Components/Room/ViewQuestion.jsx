import React, { useEffect, useState } from 'react';
import { useSocketContext } from '../../context/SocketContext';
import Notification from "../Notification/Notification.jsx";

const ViewQuestion = ({roomId, handleNextQuestion} ) => {
  const { question,sendResponse,responseCounts,responseValid } = useSocketContext();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    setAnswers(question?.question?.Answers || []);
    handleNextQuestion();
  }, [question]);

  useEffect(() => {
    if (selectedAnswer !== null && responseValid == null) {
      sendResponse(roomId, question.idQuizz, question.question?.id, selectedAnswer);
    }  
  }, [selectedAnswer,answers]);

  return (
    <div className="viewQuestionheightQuizz">
      <h2>Quizz</h2>
      Temps : {question.question?.time}
      <div className='centreQuizz card border w-2/3 bg-base-100 shadow-md rounded-2xl p-5'>
        
        Question : {question.question?.name}
        <ul>
          {answers.map((answer, index) => (
            <li key={answer.id} className={responseValid === answer.id ? "valid" : ""}>
              <label className='answerAlone' >
                <input
                  type="radio"
                  className="radio"
                  name="answer"
                  value={answer.id}
                  checked={selectedAnswer === answer.id}
                  onChange={() => { 
                    if (responseValid == null) {
                      setSelectedAnswer(answer.id);
                    }}}
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

export default ViewQuestion;

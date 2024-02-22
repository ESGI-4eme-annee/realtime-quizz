import React, { useEffect, useState } from 'react';
import { useSocketContext } from '../../context/SocketContext';

const ViewQuestion = ({roomId, handleNextQuestion} ) => {
  const { question,sendResponse,responseCounts,responseValid } = useSocketContext();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  

  useEffect(() => {
    setAnswers(question?.question?.Answers || []);
    handleNextQuestion();
    
  }, [question]);

  useEffect(() => {
   sendResponse(roomId, question.idQuizz, question.question?.id, selectedAnswer);
  
  }, [selectedAnswer,answers]);

  return (
    <div className="viewQuestionheightQuizz">
      <h2>Quizz</h2>
      Temps : {question.question?.time}
      <div className='centreQuizz'>
        
        Question : {question.question?.name}
        <ul>
          {answers.map((answer, index) => (
            <li key={answer.id} className={responseValid?.response === answer.id ? "valid" : ""}>
              <label className='answerAlone' >
                <input
                  type="radio"
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

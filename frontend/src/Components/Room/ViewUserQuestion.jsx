import React, { useEffect, useState } from 'react';
import { useSocketContext } from '../../context/SocketContext';

const ViewUserQuestion = ({nextQuestion, roomId, handleNextQuestion} ) => {
  // const { question,sendResponse,responseCounts,responseValid } = useSocketContext();

  // const [selectedAnswer, setSelectedAnswer] = useState(null);
  // const [answers, setAnswers] = useState([]);

  // useEffect(() => {
  //   setAnswers(question?.question?.Answers || []);
  //   handleNextQuestion();
  // }, [question]);

  // useEffect(() => {
  //   if (selectedAnswer !== null && responseValid == null) {
  //     sendResponse(roomId, question.idQuizz, question.question?.id, selectedAnswer);
  //   }  
  // }, [selectedAnswer,answers]);

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
                  // onChange={() => { 
                  //   if (responseValid == null) {
                  //     setSelectedAnswer(answer.id);
                  //   }}}
                />
                {answer.name}
                {/* ( {responseCounts[answer.id] || 0}) */}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewUserQuestion;

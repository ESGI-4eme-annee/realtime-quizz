import React, { useEffect, useState } from "react";
import { useSocketContext } from '../../context/SocketContext';

const ViewQuizz = ({ quizz }) => {
  const { socket } = useSocketContext();
  const [time, setTime] = useState(null); // WIP

  useEffect(() => {
    socket.on('timer', (time) => {
      setTime(time);
    });
  }, []);


  return (
    <div className="w-full flex flex-col">
      <h2 className="text-3xl border-b mb-6 pb-2">Partie administration</h2>
      <h2 className="mb-2">
        Nom du quizz : 
        <span className="font-bold ml-2">
          {quizz.name}
        </span>
      </h2>
      {quizz.Questions.map((question, index) => (
        <div key={question.id} className="card border w-2/3 bg-base-100 shadow-md rounded-2xl p-5">
          <div className="card-body">
            <h2 className="card-title font-semibold mb-2">Question : {question.name}</h2>
            {question.Answers.map((answer, index) => (
              <li key={answer.id}>
                  <span className={answer.valid ? "text-green-700 font-semibold" : "text-red-700 font-semibold"}>{answer.name}</span>
              </li>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewQuizz;

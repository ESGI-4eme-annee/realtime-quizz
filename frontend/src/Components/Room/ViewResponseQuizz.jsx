import React from 'react';

function ViewResponseQuizz({questions}) {
    return (
        <div className="flex flex-wrap gap-5 w-full max-w-7xl">
            { 
                questions.map((question, index) => (
                    <div key={question.id} className="card border w-80 bg-base-100 shadow-md rounded-2xl p-5 mb-4">
                        <div className="card-body">
                        <h2 className="card-title font-semibold mb-2">Question : {question.name}</h2>
                            {question.Answers.map((answer) => (
                                <li key={answer.id}>
                                    <span className={answer.valid ? "text-green-700 font-semibold" : "text-red-700 font-semibold"}>{answer.name}</span>
                                </li>
                            ))}
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default ViewResponseQuizz;
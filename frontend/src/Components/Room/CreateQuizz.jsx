import React, { useState } from 'react';
import postQuizz from '../../hook/postQuizz'

const CreateQuizz = ({setShowQuizzCreate}) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [correctOption, setCorrectOption] = useState('');
  const [quizz, setQuizz] = useState([]);
  const [title, setTitle] = useState('');

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleTitlehange = (event) => {
    setTitle(event.target.value);
    };

  const handleOptionChange = (index, event) => {
    const newOptions = [...options];
    newOptions[index] = event.target.value;
    setOptions(newOptions);
  };

  const handleCorrectOptionChange = (event) => {
    setCorrectOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // console.log('Question:', question);
    // console.log('Options:', options);
    // console.log('Réponse correcte (QCM):', correctOption);

    setQuizz([...quizz, { question, options, correctOption }]);
    setQuestion('');
    setOptions(['', '', '']);
    setCorrectOption('');
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuizz = [...quizz];
    updatedQuizz.splice(index, 1);
    setQuizz(updatedQuizz);
  };

  const handleSendQuizz = async () => {
    console.log('Quizz:', quizz);
    await postQuizz({"name" : title ,"quizz" : quizz });
    setShowQuizzCreate(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Title</h2>
        <input type="text" value={title} onChange={handleTitlehange} />
        <label>
          Question:
          <input type="text" value={question} onChange={handleQuestionChange} />
        </label>

        <label>
          Options (séparées par une virgule):
          <input type="text" value={options.join(',')} onChange={(e) => setOptions(e.target.value.split(','))} />
        </label>

        <label>
          Réponse correcte:
          <select value={correctOption} onChange={handleCorrectOptionChange}>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Ajouter la question</button>
      </form>

      <div>
        <h2>Quizz</h2>
        <ul>
          {quizz.map((item, index) => (
            <div key={index}>
              <h3>
                Q{index + 1}: {item.question}
                <button onClick={() => handleDeleteQuestion(index)}>Supprimer</button>
              </h3>
            </div>
          ))}
        </ul>
      </div>

      <button onClick={handleSendQuizz}>Valider le quizz</button>
    </div>
  );
};

export default CreateQuizz;

import React, { useState } from 'react';
import postQuizz from '../../hook/postQuizz';

const CreateQuizz = ({ setShowQuizzCreate, setReload, reload }) => {
  const [questionName, setQuestionName] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [correctOption, setCorrectOption] = useState('');
  const [time, setTime] = useState(15);
  const [quizz, setQuizz] = useState([]);
  const [title, setTitle] = useState('');

  const handleQuestionChange = (event) => {
    setQuestionName(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleCorrectOptionChange = (event) => {
    setCorrectOption(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newQuestion = {
      question: questionName,
      time: time,
      options: options,
      correctOption: correctOption
    };

    setQuizz([...quizz, newQuestion]);

    setQuestionName('');
    setTime(15);
    setOptions(['', '', '']);
    setCorrectOption('');
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuizz = [...quizz];
    updatedQuizz.splice(index, 1);
    setQuizz(updatedQuizz);
  };

  const handleSendQuizz = async () => {
    await postQuizz({ name: title, quizz: quizz });
    setShowQuizzCreate(false);
    setReload(!reload);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Title</h2>
        <input type="text" value={title} onChange={handleTitleChange} />

        <label>
          Question:
          <input type="text" value={questionName} onChange={handleQuestionChange} />
        </label>

        <label>
          Temps de la question en seconde:
          <input type="number" value={time} onChange={handleTimeChange} />
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

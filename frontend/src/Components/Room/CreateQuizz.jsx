import React, { useEffect, useState } from 'react';
import postQuizz from '../../hook/postQuizz';

const CreateQuizz = ({ setShowQuizzCreate, setReload, reload,closeModale }) => {
  const [questionName, setQuestionName] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [correctOption, setCorrectOption] = useState('');
  const [time, setTime] = useState(15);
  const [quizz, setQuizz] = useState([]);
  const [title, setTitle] = useState('');
  const [canSubmit, setCanSubmit] = useState(true);
  const [optionNull, setOptionNull] = useState(true);

  useEffect(() => {
    const duplicateOptions = options.filter((option, index, array) => array.indexOf(option) !== index && option !== "");
  
    if ((duplicateOptions.length > 0)) {
      alert("Options en double détectées !");
      setCanSubmit(false);
    } else {
      setCanSubmit(true);
    }
   
  }, [options]);
  

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
    const hasEmptyOption = options.some((option) => option === "");

    let verifyTrueOption;
    if(correctOption !== "" && correctOption != "Choissisez une réponse")
    {
      verifyTrueOption = true;
    }else{
      verifyTrueOption = false;
    }

    if(canSubmit && !hasEmptyOption && verifyTrueOption){
    setQuizz([...quizz, newQuestion]);

    setQuestionName('');
    setTime(15);
    setOptions(['', '', '']);
    setCorrectOption('');
    }else
    {
      alert('Veuillez entrer des options différentes ou remplir tous les champs ou choisir une reponse correcte !')
    }
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuizz = [...quizz];
    updatedQuizz.splice(index, 1);
    setQuizz(updatedQuizz);
  };

  const handleSendQuizz = async () => {
    if(quizz.length > 0 && title !== ''){
      await postQuizz({ name: title, quizz: quizz });
      setShowQuizzCreate(false);
      setReload(!reload);
      closeModale(true);
    }else{
      alert('Veuillez ajouter des questions ou mettez un titre au quizz !');
    }
  };

  return (
    <div className="createQuizzAll">
      <div>
      <form  className='createQuizzForm' onSubmit={handleSubmit}>
        <h2>Titre du Quizz</h2>
        <input  className="input input-bordered w-full max-w-xs" type="text" required value={title} onChange={handleTitleChange} />

        <label className='createQuizzLabel'>
          Question:
          <input  className="input input-bordered w-full max-w-xs" type="text" required value={questionName} onChange={handleQuestionChange} />
        </label>

        <label className='createQuizzLabel'>
          Temps de la question en seconde:
          <input   className="input input-bordered w-full max-w-xs" type="number" required value={time} onChange={handleTimeChange} />
        </label>

        <label className='createQuizzLabel'>
          Options (séparées par une virgule):
          <input  className="input input-bordered w-full max-w-xs" type="text" required value={options.join(',')} onChange={(e) => setOptions(e.target.value.split(','))} />
        </label>

        <label className='createQuizzLabel'>
          Réponse correcte:
          <select className='select select-bordered w-full max-w-xs' required onChange={handleCorrectOptionChange}>
            <option defaultValue={"Choissisez une réponse"}>Choissisez une réponse</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className='btn btn-success'>Ajouter la question au quizz</button>
      </form>

      </div >
      <div  className='quizzGroupQuestion'>
        <h1>Quizz</h1>
        <ul>
          {quizz.map((item, index) => (
            <div key={index}>
              <div className='divQuestionCreate'>
                <div className='questionText'>
                  Q{index + 1}: {item.question}
                </div>
                <button onClick={() => handleDeleteQuestion(index)} className='btn btn-square'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          ))}
        </ul>
        <button onClick={handleSendQuizz} className='btn btn-primary'>Valider le quizz</button>
      </div>

    </div>
  );
};

export default CreateQuizz;

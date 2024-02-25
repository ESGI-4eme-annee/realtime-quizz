import React, { useState } from 'react';
import login from '../../hook/login';
// import '@css/RegisterLogin/RegisterLoginForm.css';
import { useNavigate } from "react-router-dom";

function FormTheme({setIsLogged}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit =  async (event) => {
    event.preventDefault();

    const data = {
      email,
      password,
    };

    if ( email != "" && password != "" ){
      try{
        const result = await login(data);

        if(error){
          setError("");
        }

        if (result.token){
          localStorage.setItem("token", result.token);
          setIsLogged(true);
          navigate("/");
        } else {
          setError(result.error);
        }
      }catch(err){
        console.error(err);
      }
    } else{
      setError("Veuillez remplir tous les champs");
    }
  }

  return (
      <form onSubmit={handleSubmit} className="register-login__form">
        <div className="register-login__form__container">
            {error && <p className="error">{error}</p>}
            <div className="register-login__form__container__field">
                <label
                    htmlFor="email"
                    className="register-login__form__container__field__label"
                >
                    Email
                </label>
                <input
                    className="input input-bordered w-full max-w-xs mb-3"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label
                    htmlFor="password"
                    className="register-login__form__container__field__label"
                >
                    Mot de passe
                </label>
                <input
                    className="input input-bordered w-full max-w-xs mb-3"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
        </div>
        <button type="submit" value="Se connecter"  className="btn btn-primary">Se connecter</button>
      </form>

  );
}

export default FormTheme;
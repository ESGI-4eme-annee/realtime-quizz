import FormLogin from './FormLogin';
// import fondRegister  from '@img/fondreg.png';
// import '@css/RegisterLogin/RegisterLoginPage.css';
import { Link } from 'react-router-dom';
import React from "react";

function LoginPage({setIsLogged}) {
    return (
        <main className="border-2 solid black display flex flex-row justify-center bg-blue-400">
            
            <div className="register-login__container">
                <div className="register-login__container__logo">
                    
                    <h2>Open Cook</h2>
                </div>
                <FormLogin setIsLogged={setIsLogged}/>
                <p>Vous n’avez pas de compte ? <Link to="/register">Inscrivez-vous</Link></p>
            </div>
        </main>
    )
}

export default LoginPage

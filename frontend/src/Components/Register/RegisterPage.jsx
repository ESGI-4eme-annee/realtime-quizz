import { Link } from 'react-router-dom';
import FormTheme from './FormTheme';
// import fondRegister  from '@img/fondreg.png';
// import '@css/RegisterLogin/RegisterLoginPage.css'
import React from "react";
function RegisterPage() {

    return (
        <main className="border-2 solid black display flex flex-row justify-center bg-blue-400 ">
            
            <div className="register-login__container">
                <div className="register-login__container__logo">
                    <h2 className="text-3xl underline text-center mb-3">Inscription</h2>
                </div>
                <FormTheme/>
                <p>Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link></p>
            </div>
        </main>
    )
}

export default RegisterPage

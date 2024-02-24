import FormLogin from './FormLogin';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { accountService } from "../../services/account.service";

function LoginPage({setIsLogged}) {

    const [userData, setUserData] = useState("");

    useEffect(() => {
        // fetchdata();
            if (localStorage.getItem("token")){
            setIsLogged(true);}
    }, []);

    

    return (
        <main className="border-2 solid black display flex flex-row justify-center bg-blue-400">
            
            {/* <p>Bonjour {userData.userEmail} </p> */}

            <div className="register-login__container">
                <div className="register-login__container__logo">
                    <h2 className="text-3xl underline text-center mb-3">Connexion</h2>
                </div>
                <FormLogin setIsLogged={setIsLogged}/>
                <p>Vous n’avez pas de compte ? <Link to="/register">Inscrivez-vous</Link></p>
            </div>
        </main>
    )
}

export default LoginPage

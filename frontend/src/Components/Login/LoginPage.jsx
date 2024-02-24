import FormLogin from './FormLogin';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { accountService } from "../../services/account.service";
import '../../assets/css/registerLogin.css';


function LoginPage({setIsLogged}) {

    const [userData, setUserData] = useState("");

    useEffect(() => {
        // fetchdata();
            if (localStorage.getItem("token")){
            setIsLogged(true);}
    }, []);

    

    return (
        <div className='flexLog'>
        <div className=" connection">
            
                    <h2 className="text-3xl text-center mb-3">Connexion</h2>
                <FormLogin setIsLogged={setIsLogged}/>
                <p className='mt-5 text-white '>Vous n’avez pas de compte ? <Link to="/register">Inscrivez-vous</Link></p>
            </div>
            </div>
    )
}

export default LoginPage

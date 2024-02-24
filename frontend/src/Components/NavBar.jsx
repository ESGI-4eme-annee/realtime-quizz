import React from 'react';
import { Outlet, Link } from "react-router-dom";
// import '@css/NavBar.css';

function NavBar({ isLogged }) {
    return (
        <>
            <header>
                <nav>
                    <ul className="flex bg-black text-white h-14 justify-center items-center">  
                        <li className="px-10 text-xl">
                            <Link to="/">Home</Link>
                        </li>   
                        {
                            isLogged ?
                            <li className="px-10 text-xl">
                                <Link to="/" onClick={() => { 
                                    localStorage.removeItem('token'); 
                                    document.cookie = "";
                                    window.location.reload(); 

                                }}>Déconnexion</Link>
                            </li>
                            : <>
                                <li className="px-10 text-xl">
                                    <Link to="/login">Connexion</Link>
                                </li>
                                <li className="px-10 text-xl">
                                    <Link to="/register">Inscription</Link>
                                </li>
                            </>
                        }                  
                    </ul>
                </nav>
            </header>
        </>
    );
}

export default NavBar;
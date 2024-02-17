import React from 'react';
import { Outlet, Link } from "react-router-dom";
// import '@css/NavBar.css';

function NavBar() {
    return (
        <>
            <header>
                <nav>
                    <ul>                       
                        <>
                            <li>
                                <Link to="/login">Connexion</Link>
                            </li>
                            <li className="register">
                                <Link to="/register">Inscription</Link>
                            </li>
                        </>                   
                    </ul>
                </nav>
            </header>
        </>
    );
}

export default NavBar;
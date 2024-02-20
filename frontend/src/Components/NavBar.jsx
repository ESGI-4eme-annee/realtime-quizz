import React from 'react';
import { Outlet, Link } from "react-router-dom";
// import '@css/NavBar.css';

function NavBar() {
    return (
        <>
            <header>
                <nav>
                    <ul className=" flex-row bg-black  text-white ">                       
                        <>
                            <li>
                                <Link to="/login">Connexion</Link>
                            </li>
                            <li>
                                <Link to="/register">Inscription</Link>
                            </li>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                        </>                   
                    </ul>
                </nav>
            </header>
        </>
    );
}

export default NavBar;
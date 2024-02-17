import React from 'react';

function RegisterCard() {
    return (
        <div className="register-card">
            <div className="register-header">
                <p className="register-title">Prenom</p>
                <input className="register-title" type="text" ></input>
                <p className="register-title">Email</p>
                <input className="register-title" type="text"></input>
                <p className="register-title">Mot de passe</p>
                <input className="register-title" type="text"></input>
            </div>
        </div>
    );
}

export default RegisterCard; // Assurez-vous d'ajouter cette ligne pour exporter correctement le composant

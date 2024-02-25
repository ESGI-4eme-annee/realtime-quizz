import { Link } from 'react-router-dom';
import FormTheme from './FormTheme';
function RegisterPage() {

    return (
        <div className='flexLog'>
        <div className="bg-base-300 connection border-solid border-2 border-neutral-content">
            <div className="register-login__container">
                <div className="register-login__container__logo">
                    <h2 className="text-3xl text-center mb-3">Inscription</h2>
                </div>
                <FormTheme/>
                <p className='mt-5'>Vous avez déjà un compte ? <Link to="/login" className="text-primary">Connectez-vous</Link></p>
            </div>
        </div>
        </div>
    )
}

export default RegisterPage

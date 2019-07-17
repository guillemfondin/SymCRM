import React, {useState, useContext} from 'react';
import AuthAPI from '../services/AuthAPI';
import AuthContext from '../contexts/AuthContext';
import Field from '../components/forms/Field';
import { toast } from 'react-toastify';

const LoginPage = ({ history }) => {
    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "test@test.fr",
        password: "password"
    });
    const [error, setError] = useState('');

    /**
     * Change credentials
     * 
     * @param {*} event 
     */
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;

        setCredentials({ ...credentials, [name]: value });
    }

    /**
     * Gestion du submit
     * 
     * @param {*} event 
     */
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            toast.success("Vous êtes désormais connecté");
            history.replace("/customers");
        } catch (e) {
            setError("Aucun compte ne possède cette adresse email ou alors les informations ne correspondent pas");
            toast.error("Une erreur est survenue");
        }
    }

    return ( 
        <>
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    label="Adresse email"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Adresse email de connexion"
                    error={error}
                />
                <Field
                    label="Mot de passe"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Votre mot de passe"
                    type="password"
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Connexion</button>
                </div>
            </form>
        </>
    );
}
 
export default LoginPage;
import React, {useState, useContext} from 'react';
import AuthAPI from '../services/AuthAPI';
import AuthContext from '../contexts/AuthContext';

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
            history.replace("/customers");
        } catch (e) {
            setError("Aucun compte ne possède cette adresse email ou alors les informations ne correspondent pas");
        }
    }

    return ( 
        <>
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Adresse email</label>
                    <input
                        type="email"
                        onChange={handleChange}
                        value={credentials.username}
                        placeholder="Adresse email de connexion"
                        name="username"
                        id="username"
                        className={"form-control" + (error ? " is-invalid" : '')}
                    />
                    {error && 
                        <p className="invalid-feedback">
                            {error}
                        </p>
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        onChange={handleChange}
                        value={credentials.password}
                        placeholder="Votre mot de passe"
                        name="password"
                        id="password"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Connexion</button>
                </div>
            </form>
        </>
    );
}
 
export default LoginPage;
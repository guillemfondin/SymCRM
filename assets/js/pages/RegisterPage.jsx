import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import AuthAPI from '../services/AuthAPI';
import { toast } from 'react-toastify';

const RegisterPage = ({history}) => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    /**
     * Gestion des changements des inputs dans le form
     * 
     * @param {*} param0 
     */
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setUser({...user, [name]: value});
    };

    /**
     * Gestion de l'envoie du formulaire
     * 
     * @param {*} event 
     */
    const handleSubmit = async event => {
        event.preventDefault();

        const apiErrors = {};

        if (user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm = "Votre mot de passe ne correspond pas";
            setErrors(apiErrors);
            toast.error("Votre formulaire ne semble pas correcte");
            return;
        }

        try {
            await AuthAPI.create(user);
            setErrors({});
            toast.success("Vous êtes maintenant inscrit, connectez vous !");
            history.replace('/login');
        } catch ({ response }) {
            const { violations } = response.data;

            if (violations) {
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
            }
            toast.error("Votre formulaire ne semble pas correcte");
        }
    }

    return (
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre prénom"
                    error={errors.firstName}
                    value={user.firstName}
                    onChange={handleChange}
                />
                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Votre nom de famille"
                    value={user.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="email"
                    label="Email"
                    placeholder="Votre adresse email"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    name="password"
                    label="Mot de passe"
                    placeholder="Votre mot de passe"
                    type="password"
                    value={user.password}
                    onChange={handleChange}
                    error={errors.password}
                />
                <Field
                    name="passwordConfirm"
                    label="Confirmation - Mot de passe"
                    placeholder="Confirmez votre mot de passe"
                    type="password"
                    value={user.passwordConfirm}
                    onChange={handleChange}
                    error={errors.passwordConfirm}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Inscription</button>
                    <Link to="/login" className="btn btn-link">Connexion</Link>
                </div>
            </form>
        </>
    );
}
 
export default RegisterPage;
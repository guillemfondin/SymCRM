import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import CustomersAPI from '../services/CustomersAPI';
import { toast } from 'react-toastify';

const CustomerPage = ({match, history}) => {
    const { id = "new" } = match.params;
    
    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [editing, setEditing] = useState(false);

    /**
     * Récupération du customer en function de l'id
     * 
     * @param {*} id 
     */
    const fetchCustomer = async id => {
        try {
            const {firstName, lastName, email, company } = await CustomersAPI.findOneById(id);
            setCustomer({firstName, lastName, email, company });
        } catch (e) {
            console.log(e.response);
            toast.error("Impossible de charger les données");
            history.replace("/customers");
        }
    }

    /**
     * Chargement si besoin du customer
     * Au chargement ou au changement de l'identifiant
     */
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    /**
     * Gestion des changements des inputs dans le form
     * 
     * @param {*} param0 
     */
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setCustomer({...customer, [name]: value});
    };

    /**
     * Gestion de l'envoie du formulaire
     * 
     * @param {*} event 
     */
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            setErrors({});

            if (editing) {
                await CustomersAPI.update(id, customer);
                toast.success("Le client a bien été modifié");
            } else {
                await CustomersAPI.create(customer);
                toast.success("Le client a bien été créé");
                history.replace("/customers");
            }
        } catch ({ response }) {
            const { violations } = response.data;

            if (violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
            }
            toast.error("IL y a un problème dans le formulaire");
        }
    }

    return (
        <>
            {!editing && <h1>Création d'un client</h1> || <h1>Modification du client</h1>}
            <form onSubmit={handleSubmit}>
                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Nom de famille du client"
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Prénom du client"
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    name="email"
                    label="Email"
                    placeholder="Adresse email du client"
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}
                    type="email"
                />
                <Field
                    name="company"
                    label="Entreprise"
                    placeholder="Entreprise du client"
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>
        </>
    );
}
 
export default CustomerPage;
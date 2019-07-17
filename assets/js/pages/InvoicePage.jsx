import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import InvoicesAPI from '../services/InvoicesAPI';
import CustomersAPI from '../services/CustomersAPI';
import { toast } from 'react-toastify';

const InvoicePage = ({match, history}) => {
    const { id = "new" } = match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });

    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });
    
    const [customers, setCustomers] = useState([]);

    const [editing, setEditing] = useState(false);

    /**
     * Récupération du customer en function de l'id
     * 
     * @param {*} id 
     */
    const fetchInvoice = async id => {
        try {
            const {amount, customer, status } = await InvoicesAPI.findOneById(id);
            setInvoice({amount, customer: customer.id, status });
        } catch (e) {
            console.log(e.response);
            toast.error("Impossible de charger les données");
            history.replace("/invoices");
        }
    }

    /**
     * Récupération des customers
     */
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            if (!invoice.customer) setInvoice({...invoice, customer: data[0].id });
        } catch (e) {
            console.log(e.response);
            toast.error("Impossible de charger les données");
            history.replace("/invoices");
        }
    }

    /**
     * Chargement si besoin du customer
     * Au chargement ou au changement de l'identifiant
     */
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id]);

    /**
     * Chargement des customers
     */
    useEffect(() => {
        fetchCustomers();
    }, []);

    /**
     * Gestion des changements des inputs dans le form
     * 
     * @param {*} param0 
     */
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setInvoice({...invoice, [name]: value});
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
                await InvoicesAPI.update(id, invoice);
                toast.success("La facture a bien été modifiée");
            } else {
                await InvoicesAPI.create(invoice);
                toast.success("La facture a bien été crée");
                history.replace("/invoices");
            }
        } catch ({ response }) {
            const { violations } = response.data;

            if (violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
                toast.error("Le formulaire est incomplet");
            }
        }
    }


    return (
        <>            
            {!editing && <h1>Nouvelle facture</h1> || <h1>Éditer la facture</h1>}
            <form onSubmit={handleSubmit}>
                <Field
                    name="amount"
                    type="number"
                    placeholder="Montant de la facture"
                    label="Montant"
                    onChange={handleChange}
                    value={invoice.amount}
                    error={errors.amount}
                />

                <Select
                    name="customer"
                    label="Client"
                    value={invoice.customer}
                    error={errors.customer}
                    onChange={handleChange}
                >
                    {customers.map(customer =>
                        <option value={customer.id} key={customer.id}>
                            {customer.firstName} {customer.lastName}
                        </option>
                    )}
                </Select>

                <Select
                    name="status"
                    label="Statut"
                    value={invoice.status}
                    error={errors.status}
                    onChange={handleChange}
                >
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/invoices" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>
        </>
    );
}
 
export default InvoicePage;
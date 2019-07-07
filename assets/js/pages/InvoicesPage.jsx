import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesAPI from '../services/InvoicesAPI';

const STATUS_CLASSES = {
    PAYED: "success",
    SENT: "primary text-light",
    CANCELLED: "danger"
};

const STATUS_LABELS = {
    PAYED: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
};

const InvoicesPage = (props) => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');

    const itemsPerPage = 10;

    /**
     * Récupère les invoices
     */
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll();
            setInvoices(data);
        } catch(e) {
            console.log(e.response);
        }
    }

    /**
     * Charger les invoices au chargement du composant
     */
    useEffect(() => {fetchInvoices();}, []);

    /**
     * Gestion du format de date
     * 
     * @param {*} str 
     */
    const formatDate = str => moment(str).format('DD/MM/YYYY');

    /**
     * Gestion du changement de page
     * 
     * @param {*} page 
     */
    const handlePageChange = page => setCurrentPage(page);

    /**
     * Gestion de la recherche
     * 
     * @param {*} event 
     */
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    /**
     * Supprime une invoice
     * 
     * @param {*} id 
     */
    const handleDelete = async id => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id))

        try {
            await InvoicesAPI.delete(id);
        } catch (e) {
            setInvoices(originalInvoices);
            console.log(e.response);
        }
    };

    /**
     * Filtre les customers en fonction de la recherche
     */
    const filteredInvoices = invoices.filter(
        i => 
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) || 
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    /**
     * Pagination des données
     */
    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage);

    return (
    <>
        <h1>Liste des factures</h1>

        <div className="form-group">
            <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher"/>
        </div>

        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Numéro</th>
                    <th>Client</th>
                    <th className="text-center">Date d'envoi</th>
                    <th className="text-center">Statut</th>
                    <th className="text-center">Montant</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {paginatedInvoices.map(invoice =>
                    <tr key={invoice.id}>
                        <td>{invoice.id}</td>
                        <td>
                            <a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a>
                        </td>
                        <td className="text-center">{formatDate(invoice.sentAt)}</td>
                        <td className="text-center">
                            <span className={"badge badge-" + STATUS_CLASSES[invoice.status] + " py-1 px-2"}>{STATUS_LABELS[invoice.status]}</span>
                        </td>
                        <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                        <td>
                            <button className="btn btn-sm btn-primary mr-1 text-white">Éditer</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>

        <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} length={filteredInvoices.length} />
    </>
    );
}
 
export default InvoicesPage;
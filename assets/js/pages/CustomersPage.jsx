import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import CustomersAPI from '../services/CustomersAPI';
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';

const CustomersPage = (props) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const itemsPerPage = 10;

    /**
     * Récupère les customers
     */
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setLoading(false);
        } catch(e) {
            console.log(e.response);
            toast.error("Impossible de charger les données");
        }
    }

    /**
     * Chargement du composant, récupération des customers
     */
    useEffect(() => {fetchCustomers()}, []);

    const handleDelete = async id => {
        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id))

        try {
            await CustomersAPI.delete(id);
            toast.success("Le client a bien été supprimé");
        } catch (e) {
            setCustomers(originalCustomers);
            toast.error("Impossible de supprimer le client");
            console.log(e.response);
        }
    };

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
     * Filtre les customers en fonction de la recherche
     */
    const filteredCustomers = customers.filter(
        c => 
            c.firstName.toLowerCase().includes(search.toLowerCase()) || 
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );

    /**
     * Pagination des données
     */
    const paginatedCustomers = Pagination.getData(filteredCustomers, currentPage, itemsPerPage);

    return (
        <>
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h1>Liste des clients</h1>
            <Link to="/customers/new" className="btn btn-success">Ajouter un client</Link>
        </div>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher"/>
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant total</th>
                        <th></th>
                    </tr>
                </thead>
                {!loading && <tbody>
                    {paginatedCustomers.map(customer => 
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>
                                <Link to={"/customers/" + customer.id}>{customer.firstName} {customer.lastName}</Link>
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className="text-center">
                                <span className="badge badge-primary text-white py-1 px-2">{customer.invoices.length}</span>
                            </td>
                            <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                            <td>
                                <button
                                    onClick={() => handleDelete(customer.id)}
                                    disabled={customer.invoices.length > 0}
                                    className="btn btn-sm btn-danger"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>}
            </table>

            {loading && <TableLoader />}

            {filteredCustomers.length > itemsPerPage &&
                <Pagination
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    length={filteredCustomers.length}
                    onPageChange={handlePageChange}
                />
            }
        </>
    );
}
 
export default CustomersPage;
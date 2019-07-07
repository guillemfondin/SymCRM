import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';

const CustomersPageWithPagination = (props) => {
    const [customers, setCustomers] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    useEffect(() => {
        axios.get(`http://symcrm:8888/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
             .then(response => {
                setCustomers(response.data['hydra:member']);
                setTotalItems(response.data['hydra:totalItems']);
                setLoading(false);
             })
             .catch(e => console.log(e.response))
        ;
    }, [currentPage]);

    const handleDelete = (id) => {
        const originalCustomers = [...customers];

        setCustomers(customers.filter(customer => customer.id !== id))
        
        axios.delete("http://symcrm:8888/api/customers/" + id)
             .then(response => console.log("ok"))
             .catch(e => {
                setCustomers(originalCustomers);
                console.log(e.response);
             })
        ;
    };

    const handlePageChange = page =>{
        setCurrentPage(page);
        setLoading(true);
    }

    const paginatedCustomers = Pagination.getData(customers, currentPage, itemsPerPage);

    return (
        <>
            <h1>Liste des clients</h1>

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
                <tbody>
                    {loading && (
                        <tr>
                            <td>Chargement...</td>
                        </tr>
                    )}
                    {!loading && 
                    customers.map(customer => 
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>
                                <a href="#">{customer.firstName} {customer.lastName}</a>
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
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={totalItems}
                onPageChange={handlePageChange}
            />
        </>
    );
}
 
export default CustomersPageWithPagination;
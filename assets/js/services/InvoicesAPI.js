import axios from 'axios';

function findAll() {
    return axios.get("http://symcrm:8888/api/invoices")
                .then(response => response.data['hydra:member'])
    ;
}

function deleteInvoice(id) {
    return axios.delete("http://symcrm:8888/api/invoices/" + id);
}

export default {
    findAll,
    delete: deleteInvoice
}
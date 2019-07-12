import axios from 'axios';

function findAll() {
    return axios.get("http://symcrm:8888/api/invoices")
                .then(response => response.data['hydra:member'])
    ;
}

function findOneById(id) {
    return axios.get("http://symcrm:8888/api/invoices/" + id)
                .then(response => response.data);

}

function create(invoice) {
    return axios.post("http://symcrm:8888/api/invoices", {...invoice, customer: `/api/customers/${invoice.customer}`});
}

function update(id, invoice) {
    return axios.put("http://symcrm:8888/api/invoices/" + id, {...invoice, customer: `/api/customers/${invoice.customer}`});
}

function deleteInvoice(id) {
    return axios.delete("http://symcrm:8888/api/invoices/" + id);
}

export default {
    findAll,
    findOneById,
    create,
    update,
    delete: deleteInvoice
}
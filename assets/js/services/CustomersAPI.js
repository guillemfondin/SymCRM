import axios from 'axios';

function findAll() {
    return axios.get("http://symcrm:8888/api/customers")
                .then(response => response.data['hydra:member'])
    ;
}

function deleteCustomer(id) {
    return axios.delete("http://symcrm:8888/api/customers/" + id);
}

export default {
    findAll,
    delete: deleteCustomer
}
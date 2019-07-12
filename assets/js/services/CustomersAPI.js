import axios from 'axios';

function findAll() {
    return axios.get("http://symcrm:8888/api/customers")
                .then(response => response.data['hydra:member'])
    ;
}

function findOneById(id) {
    return axios.get("http://symcrm:8888/api/customers/" + id)
                .then(response => response.data);

}

function create(customer) {
    return axios.post("http://symcrm:8888/api/customers", customer);
}

function update(id, customer) {
    return axios.put("http://symcrm:8888/api/customers/" + id, customer);
}

function deleteCustomer(id) {
    return axios.delete("http://symcrm:8888/api/customers/" + id);
}

export default {
    findAll,
    findOneById,
    create,
    update,
    delete: deleteCustomer
}
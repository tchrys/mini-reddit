const {
    queryAsync
} = require('..');

const addAsync = async (user_id, improv_type, request) => {
    const queryText = 'INSERT INTO improvement_request (user_id, improv_type, request, req_date) VALUES ($1, $2, $3, $4) RETURNING *'
    const req = await queryAsync(queryText, [user_id, improv_type, request, new Date()]);
    return req[0];
};

const getAllAsync = async () => {
    return await queryAsync('SELECT ir.id, user_id, improv_type, request, req_date, u.username FROM improvement_request ir INNER JOIN users u ON u.id = ir.user_id');
};

const getByIdAsync = async (id) => {
    return await queryAsync('SELECT * FROM improvement_request WHERE id = $1', [id]);
};

const deleteByIdAsync = async (id) => {
    const queryText = 'DELETE FROM improvement_request WHERE id = $1 RETURNING *'
    const req = await queryAsync(queryText, [id]);
    return req[0];

};

module.exports = {
    addAsync,
    getAllAsync,
    getByIdAsync,
    deleteByIdAsync
}
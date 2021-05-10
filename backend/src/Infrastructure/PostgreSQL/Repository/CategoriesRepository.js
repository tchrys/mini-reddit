const {
    queryAsync
} = require('..');

const addAsync = async (name) => {
    const categories = await queryAsync('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
    return categories[0];
};

const getAllAsync = async () => {
    return await queryAsync('SELECT * FROM categories');
};

const getByIdAsync = async (id) => {
    const categories = await queryAsync('SELECT * FROM categories WHERE id = $1', [id]);
    return categories[0];
};

const updateByIdAsync = async (id, name) => {
    const categories =  await queryAsync('UPDATE categories SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
    return categories[0];
};

const deleteByIdAsync = async (id) => {
    const categories = await queryAsync('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    return categories[0];

};

module.exports = {
    addAsync,
    getAllAsync,
    getByIdAsync,
    updateByIdAsync,
    deleteByIdAsync
}
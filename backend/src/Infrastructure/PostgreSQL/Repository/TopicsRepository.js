const {
    queryAsync
} = require('..');

const addAsync = async (name, category_id) => {
    const queryText = 'INSERT INTO topics (name, category_id) VALUES ($1, $2) RETURNING *';
    const topics = await queryAsync(queryText, [name, category_id]);
    return topics[0];
};

const getAllAsync = async () => {
    return await queryAsync('SELECT * FROM topics');
};

const getByIdAsync = async (id) => {
    const topics = await queryAsync('SELECT * FROM topics WHERE id = $1', [id]);
    return topics[0];
};

const updateByIdAsync = async (id, name) => {
    const topics =  await queryAsync('UPDATE topics SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
    return topics[0];
};

const deleteByIdAsync = async (id) => {
    const topics = await queryAsync('DELETE FROM topics WHERE id = $1 RETURNING *', [id]);
    return topics[0];
};

const getAllByCategoryId = async(category_id) => {
    return await queryAsync('SELECT * FROM topics WHERE category_id = $1', [category_id]);
}

const getPopularTopics = async() => {
    return await queryAsync('SELECT t.id, t.name, (select count(*) FROM questions q where q.topic_id = t.id) as score FROM topics t order by score desc limit 10');
}

module.exports = {
    addAsync,
    getAllAsync,
    getByIdAsync,
    updateByIdAsync,
    deleteByIdAsync,
    getAllByCategoryId,
    getPopularTopics
}
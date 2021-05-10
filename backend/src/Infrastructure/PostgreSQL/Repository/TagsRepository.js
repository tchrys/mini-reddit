const {
    queryAsync
} = require('..');

const addAsync = async (name) => {
    const existingTag = await getByName(name);
    if (!existingTag) {
        const tags = await queryAsync('INSERT INTO tags (name) VALUES ($1) RETURNING *', [name]);
        return tags[0];
    }
    return existingTag;
};

const getAllAsync = async () => {
    return await queryAsync('SELECT * FROM tags');
};

const getByIdAsync = async (id) => {
    const tags = await queryAsync('SELECT * FROM tags WHERE id = $1', [id]);
    return tags[0];
};

const updateByIdAsync = async (id, name) => {
    const tags = await queryAsync('UPDATE tags set name = $1 where id = $2', [name, id]);
    return tags[0];
}

const getByNameContains = async (search) => {
    return await queryAsync('SELECT * FROM tags WHERE name LIKE $1', ['%' + search + '%']);
}

const getByName = async (name) => {
    const tags = await queryAsync('SELECT * FROM tags where name = $1', [name]);
    return tags[0];
}

const deleteByIdAsync = async (id) => {
    await queryAsync('DELETE FROM questions_tags where tag_id = $1', [id]);
    const tags = await queryAsync('DELETE FROM tags WHERE id = $1 RETURNING *', [id]);
    return tags[0];

};

module.exports = {
    addAsync,
    getAllAsync,
    getByIdAsync,
    getByNameContains,
    getByName,
    updateByIdAsync,
    deleteByIdAsync
}